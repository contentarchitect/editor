<template>
    <div class="image-block">
        <div v-for="(image, i) in value.images" :key="i" ref="figure">
            <div v-if="image.image" class="image">
                <img :src="image.image" style="width:100%">

                <ui-button @click="selectImage(i)" v-if="image.image" class="change-button" v-tooltip="'Change image'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </ui-button>
            </div>

            <div v-else class="no-image" @click="selectImage(i)" :placeholder="placeholder">
            </div>

            <input type="file" v-show="false" ref="imageInput" @change="readURL($event, i)">
            <div><Editable v-model="image.caption" /></div>
        </div>
    </div>
</template>

<script>
import { Button, Editable } from "@contentarchitect/base"
import { VTooltip } from "v-tooltip"
 
export default {
    props: ['value'],
    components: {
        Editable,
        [Button.name]: Button,
    },
    directives: { tooltip: VTooltip },
    data () {
        return {
            emptyImage: { image: null, caption: null },
            placeholder: "Drag a 🖼️ or select your computer"
        }
    },
    mounted () {
        this.imageCount = this.value.images.length;
    },
    methods: {
        selectImage (index) {
            let imageInput = this.$refs.imageInput[index];
            imageInput.click();
        },
        // attemptUpload(image) {
        //     if (image){
        //     FormDataPost('http://localhost:8001/user/picture', image)
        //         .then(response=>{
        //             if (response.data.success){
        //                 image = '';
        //                 console.log("Image uploaded successfully ✨");
        //             }
        //         })
        //         .catch(err=>{
        //             console.error(err);
        //         });
        //     }
        // },
        readURL (event, index) {
            const input = event.target;

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = (e) => {
                    this.value.images[index].image = e.target.result
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        }
    },
    watch: {
        "value.imageCount": function (newImageCount, oldImageCount) {
            if (newImageCount > oldImageCount) {
                let addCount = newImageCount - oldImageCount;
                this.value.images.push(...Array(addCount).fill().map(_ => { return { ...this.emptyImage } }));
            } else {
                this.value.images.splice(newImageCount)
            }
        }
    }
}
</script>

<style>
figure {
    margin: 0;
}
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
    min-height: 200px;
    position: relative;
    height: calc(100% - 18px);
}

.no-image::before {
    content: attr(placeholder);
    position: absolute;
    left: 20px;
    right: 20px;
    top: 20px;
    bottom: 20px;
    border: 3px dashed #ccc;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}


.image {
    position: relative;
}

.change-button {
    position: absolute !important;
    left: 50%;
    right: 0;
    bottom: 0;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>