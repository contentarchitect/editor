<template>
    <div class="image-block">
        <div v-for="(image, i) in value.images" :key="i" ref="figure" class="image-block-image">
            <div v-if="image.image" class="image">
                <img :src="image.image" style="width:100%">

                <div class="image-overlay">
                    <Tooltip tooltip="Change image">
                        <ui-button @click="selectImage(i)" v-if="image.image" class="change-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                        </ui-button>
                    </Tooltip>
                </div>
            </div>

            <div v-else class="no-image" @click="selectImage(i)" :placeholder="placeholder">
            </div>

            <input type="file" v-show="false" ref="imageInput" @change="readURL($event, i)">
            <div><Editable v-model="image.caption" /></div>
        </div>
    </div>
</template>

<script>
import UiButton from "@/components/UiButton"
import Editable from "@/components/Editable.vue"
import Tooltip from "@/components/Tooltip.vue"
 
export default {
    props: ['value'],
    components: {
        Editable,
        [UiButton.name]: UiButton,
        Tooltip
    },
    data () {
        return {
            placeholder: "Drag a 🖼️ or select your computer"
        }
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
    /* background-color: white;
    background-image: linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef),linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef);
    background-position: 0 0,10px 10px;
    background-size: 21px 21px; */
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

.change-button {
    transition: transform .2s;
}

.image:hover .change-button {
    transform: scale(1.2);
}
</style>