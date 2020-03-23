<template>
	<div
		:style="style"
		class="image-control"
		v-show="visible"
		@mouseleave="hide"
	>
		<input
			ref="imageInput"
			type="file"
			v-if="isSelectable || uploadImage"
			v-show="false"
			@change="readData"
		/>

		<transition name="bounce" mode="out-in">
			<div key="1" v-if="!uploading && !uploaded">
				<button
					@click="openPrompt"
				>
					Enter URL
				</button>
				&nbsp;
				<button
					@click="$refs.imageInput.click()"
					v-if="isSelectable || uploadImage"
				>
					Select image
				</button>
			</div>

			<div key="2" v-else-if="uploadImage && uploaded && urlData !== '' && !removing">
				<ui-button @click="_removeImage" square class="ui-button--danger remove-button">
					✕
				</ui-button>
			</div>

			<div key="3" v-else>
				<transition
					mode="out-in"
					enter-active-class="bounce-enter-active hide-after-enter-active"
					leave-active-class="bounce-leave-active"
				>
					<div key="1" class="three-dot upload-text" v-if="uploading">
						Uploading
					</div>
					<div key="2" class="sa upload-text upload-success" v-if="!uploading && !removing && uploaded">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
						Uploaded
					</div>
					<div key="3" class="three-dot upload-text" v-if="removing">
						Removing
					</div>
				</transition>
			</div>
		</transition>
	</div>
</template>

<script>
import Util from "../scripts/Util"
import UiButton from "../components/UiButton"

export default {
	components: { UiButton },
	props: {
		url: {
			type: String,
			default: ""
		},
		isSelectable: {
			type: Boolean,
			default: false
		},
		uploadImage: {
			type: Boolean,
			default: false
		},
		uploadMethod: {
			type: Function
		},
		removeMethod: {
			type: Function
		},
		imageElement: {
			type: HTMLImageElement
		}
	},
	data () {
		return {
			visible: false,
			translateX: 0,
			translateY: 0,
			width: 0,
			height: 0,
			uploading: false,
			uploaded: false,
			removing: false,
			urlData: this.url
		}
	},
	beforeCreate () {
		// hack: flying component for adding styles to inside shadow dom
		console.log("ROOT", this.$options.root)
		this.$root = this.$options.root
	},
	computed: {
		style () {
			const transform = `translate(${this.translateX}px, ${this.translateY}px)`

			return {
				transform,
				width: this.width + 'px',
				height: this.height	+ 'px',
			}
		},
	},
	methods: {
		hide () {
			if (this.removing || this.uploading) return;

			this.visible = false
			this.active = false
		},
		show () {
			this.visible = true
			this.updateComponentPosition()
		},
		updateComponentPosition () {
			this.width = this.imageElement.offsetWidth
			this.height = this.imageElement.offsetHeight
			this.translateX = 0
			this.translateY = 0

			this.$nextTick(() => {
				const diff = Util.matchTransformMatrix({
					a: this.$el,
					b: this.imageElement,
				});

				this.translateX = diff.diffX
				this.translateY = diff.diffY
			})
		},
		openPrompt () {
			const url = prompt('Image url', this.urlData || "");

			if (url === null) return;

			this.setUrl(url)
		},
		setUrl (url) {
			this.urlData = url
			this.$emit('change', url)
		},
		readData (event) {
			const input = event.target;

			if (input.files && input.files[0]) {
				var reader = new FileReader();
				
				const self = this;

				reader.onload = (e) => {
					this.setUrl(e.target.result)

					if (this.uploadImage)
						this._uploadImage(input.files[0])

					input.value = ""
				}
				
				reader.readAsDataURL(input.files[0]);
			}
		},
		_uploadImage (imageFile) {
			this.uploading = true
			this.uploaded = false
			const _this = this

			this.uploadMethod(imageFile)
				.then((url) => {
					_this.setUrl(url)
					_this.uploading = false
					_this.uploaded = true
				})
				.catch(err => {
					debugger;
					_this.uploading = false
					_this.uploaded = false
					console.error(err)
				})
		},
		_removeImage () {
			if (this.uploadImage) {
				this.removing = true

				const _this = this
				this.removeMethod()
					.then(() => {
						_this.setUrl("")
						_this.uploaded = false
						_this.removing = false

					})
					.catch(err => {
						this.removing = false
						alert(`This image couldn't be deleted. Error: ${error}`)
						console.error(err)
					})
			}
		}
	}
}
</script>

<style scoped>
.image-control {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, .1);
	color: white;
	z-index: 1;
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