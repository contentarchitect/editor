<template>
	<div class="image-block">
		<figure v-for="(image, i) in value.images" :key="i" ref="figure" class="image-block-image">
			<transition name="bounce" mode="out-in">
				<div key="1" v-if="image.url" class="image">
					<img :src="image.url" style="width:100%">

					<div class="image-overlay" v-if="!image.uploading">
						<Tooltip tooltip="Remove image">
							<ui-button @click="removeImage(i)" square class="ui-button--danger remove-button">
								✕
							</ui-button>
						</Tooltip>
					</div>

					<div class="image-overlay upload-info" v-if="value.constructor.settings.uploadImages">
						<transition
							mode="out-in"
							enter-active-class="bounce-enter-active hide-after-enter-active"
							leave-active-class="bounce-leave-active"
						>
							<div key="1" class="three-dot upload-text" v-if="image.uploading">
								Uploading
							</div>
							<div key="2" class="sa upload-text upload-success" v-if="image.uploaded">
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
								Uploaded
							</div>
							<div key="3" class="three-dot upload-text" v-if="image.removing">
								Removing
							</div>
						</transition>
					</div>
				</div>

				<div key="2" v-else class="no-image">
					<div class="no-image-border">
						<div v-if="value.constructor.settings.uploadImages">
							<button @click="selectImage(i)">Select</button> your computer
						</div>
						<div class="upload-divider" v-if="value.constructor.settings.uploadImages">
							<hr />
							<span>OR</span>
							<hr />
						</div>
						<div class="input-group">
							<input type="text" placeholder="Image URL" v-model="url" /><button @click="addUrl(i)">Add</button>
						</div>
					</div>
				</div>
			</transition>

			<input type="file" v-show="false" ref="imageInput" @change="readURL($event, i)">

			<figcaption><Editable v-model="image.caption" /></figcaption>
		</figure>
	</div>
</template>

<script>
import { UiButton, Editable, Tooltip } from "@contentarchitect/core"

export default {
	props: ['value'],
	components: {
		Editable,
		[UiButton.name]: UiButton,
		Tooltip
	},
	data () {
		return {
			url: ''
		}
	},
	methods: {
		selectImage (index) {
			let imageInput = this.$refs.imageInput[index];
			imageInput.click();
		},
		addUrl (index) {
			this.value.images[index].url = this.url
			this.url = ""
		},
		removeImage (index) {
			const image = this.value.images[index];
			if (this.value.constructor.settings.uploadImages
				&& image.uploaded) {
				image.removing = true
				this.value.constructor.settings.remove(image)
					.then(message => {
						image.url = ""
						image.removing = false
					})
					.catch(msg => {
						console.error(msg)
						image.removing = false
					})
			} else {
				image.url = ""
			}
		},
		uploadImage (image, imageFile) {
			image.uploading = true
			image.uploaded = false

			this.value.constructor.settings.upload(imageFile)
				.then(({url, data}) => {
					Object.assign(image, {
						url,
						data,
						uploading: false,
						uploaded: true
					})
				})
				.catch(err => {
					image.uploading = false
					image.uploaded = false
					console.error(err)
				})
		},
		readURL (event, index) {
			const input = event.target;

			if (input.files && input.files[0]) {
				var reader = new FileReader();
				
				reader.onload = (e) => {
					const image = this.value.images[index]
					image.url = e.target.result

					if (this.value.constructor.settings.uploadImages)
						this.uploadImage(image, input.files[0])
				}
				
				reader.readAsDataURL(input.files[0]);
			}
		}
	},
}
</script>

<style>
.image-block {
	display: flex;
}

.image-block > div {
	flex: 1;
}

.image-block > div .image-block-image {
	width: 100%;
	max-width: 100%;
}

.no-image {
	background: #f0f0f0;
	display: flex;
	min-height: 200px;
	position: relative;
	height: calc(100% - 18px);
}

.no-image-border {
	flex: 1;
	margin: 20px;
	padding: 10px;
	border: 3px dashed #ccc;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.upload-divider {
	display: flex;
	align-items: center;
	opacity: .2;
	width: 50%;
}

.upload-divider > hr {
	flex: 1;
}

.upload-divider > span {
	padding: 0 1em;
}

.image {
	position: relative;
}

.image-overlay {
	position: absolute !important;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.input-group {
	display: inline-flex;
}

.input-group > input[type=text] {
	flex: 1
}

.input-group > button {
	margin-left: -1px;
}

.remove-button {
	transition: transform .2s;
}

.upload-text {
	padding: .2em .4em; 
	background: #121212;
	color: #ccc;
	border-radius: 3px;
}

.upload-info {
	z-index: 1;
	pointer-events: none;
}

.upload-success {
	display: none;
	background-color: rgba(0, 122.5, 0, 0.5);
	color: #fff;
	flex-direction: column;
	align-items: center;
}

.upload-success > svg {
	fill: #fff
}

.upload-success.hide-after-enter-active {
	transition-duration: 2s;
	display: inline-flex;
}

.image:hover .remove-button {
	transform: scale(1.2);
}

.bounce-enter-active {
  animation: bounce-in .3s;
}

.bounce-leave-active {
  animation: bounce-in .3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.three-dot::after {
	content: '';
	display: inline-block;
	width: 20px;
    animation: threedot 1s infinite;
    animation-direction: alternate;
}

@keyframes threedot {
  33% {
  	content: "."
  }
  66% {
  	content: ".."
  }
  
  100% {
  	content: "..."
  }
}
</style>