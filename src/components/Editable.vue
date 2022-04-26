<template>
    <div class="is-wrapper"></div>
</template>

<script>
import ContentBox from '@innovastudio/contentbox'
import "../assets/contentbox.css";
import "../assets/contentbuilder.css";
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import {addExternalScripts, addExternalStyles, renderHtml, renderStyles} from '../views/util'

export default {
    props: {
        
    },
    setup (props, context) {
        const obj = ref(null)
        const timeoutId = ref(null)
        
        // a utility to programmatically load js file (for loading language file).
        // (You can also use <script src=".."> include in html)
        const isScriptAlreadyIncluded = (src) => {
            const scripts = document.getElementsByTagName("script");
            for(let i = 0; i < scripts.length; i++) 
            if(scripts[i].getAttribute('src') === src) return true;
            return false;
        }
        const loadLanguageFile = (languageFile, callback) => {
            if(!isScriptAlreadyIncluded(languageFile)) {
                const script = document.createElement("script");
                script.src = languageFile; 
                script.async = true;
                script.onload = () => {
                    if(callback) callback();
                };
                document.body.appendChild(script);
            } else {
                if(callback) callback();
            }
        }
        const uploadFile = (e, callback) => {
            const selectedFile = e.target.files[0];
            const filename = selectedFile.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                let base64 = e.target.result;
                base64 = base64.replace(/^data:(.*?);base64,/, ""); 
                base64 = base64.replace(/ /g, '+');
        
                // Upload process
                axios.post('/upload', { image: base64, filename: filename }).then((response)=>{
                    callback(response);
                }).catch((err)=>{
                    console.log(err)
                });
            }
            reader.readAsDataURL(selectedFile);
        }

        onMounted(() => {
            // Load language file first
            loadLanguageFile('contentbox/lang/en.js', ()=>{
                // Then run the ContentBuilder
                obj.value = new ContentBox({
                    wrapper: '.is-wrapper',
                    imageSelect: '/assets.html',
                    fileSelect: '/assets.html',
                    videoSelect: '/assets.html',
                    slider: 'glide',

                    onUploadCoverImage: (e) => {
                        uploadFile(e, (response)=>{
                            const uploadedImageUrl = response.data.url; // get saved image url
                            obj.value.boxImage(uploadedImageUrl); // change cover image
                        });
                    },
                    onMediaUpload: (e)=>{
                        uploadFile(e, (response)=>{
                            const uploadedImageUrl = response.data.url; // get saved file url
                            obj.value.returnUrl(uploadedImageUrl); 
                        });
                    },
                    onVideoUpload: (e)=>{
                        uploadFile(e, (response)=>{
                            const uploadedFileUrl = response.data.url; // get saved file url
                            obj.value.returnUrl(uploadedFileUrl); 
                        });
                    },   
                    onChange: ()=>{
                        //Auto Save
                        clearTimeout(timeoutId.value);
                        timeoutId.value = setTimeout(()=>{
                            save();                    
                        }, 1000);
                    },
                    /* ContentBox settings */
                    // designUrl1: 'assets/designs/basic.js',
                    // designUrl2: 'assets/designs/examples.js',
                    // designPath: 'assets/designs/',
                    // contentStylePath: 'assets/styles/',

                    /* ContentBuilder settings */
                    // modulePath: 'assets/modules/', 
                    // fontAssetPath: 'assets/fonts/', 
                    // assetPath: 'assets/', 
                    // snippetUrl: 'assets/minimalist-blocks/content.js', 
                    // snippetPath: 'assets/minimalist-blocks/',
                    // pluginPath: 'contentbuilder/', 
                    // useLightbox: true,
                });
                // Example of adding buttons on the sidebar
                obj.value.addButton({ 
                    'pos': 2, // button position
                    'title': 'Undo', // title
                    'html': '<svg class="is-icon-flex" style="width:14px;height:14px;"><use xlink:href="#ion-ios-undo"></use></svg>', // icon
                    'onClick': ()=>{
                        obj.value.undo();
                    }
                });
                obj.value.addButton({ 
                    'pos': 3, // button position
                    'title': 'Redo', // title
                    'html': '<svg class="is-icon-flex" style="width:14px;height:14px;"><use xlink:href="#ion-ios-redo"></use></svg>', // icon
                    'onClick': ()=>{
                        obj.value.redo();
                    }
                });
                obj.value.addButton({ 
                    'pos': 5, // button position
                    'title': 'Preview', // title
                    'html': '<svg class="is-icon-flex" style="width:16px;height:16px;"><use xlink:href="#ion-eye"></use></svg>', // icon
                    'onClick': ()=>{
                        let html = obj.value.html();
                        localStorage.setItem('preview-html', html); 
                        let mainCss = obj.value.mainCss(); 
                        localStorage.setItem('preview-maincss', mainCss); 
                        let sectionCss = obj.value.sectionCss();
                        localStorage.setItem('preview-sectioncss', sectionCss);

                        window.open('/preview.html', '_blank').focus();
                    }
                });
                // Load content from the server
                axios.get('/load').then((response)=>{
                    let html, mainCss, sectionCss;

                    if(response.data.html) {
                        html = response.data.html;
                        mainCss = response.data.mainCss;
                        sectionCss = response.data.sectionCss;
                    } else {  // Or load sample content on first start
                        html = `
                        <div class="is-section is-section-100 is-shadow-1 is-bg-grey">
                            <div class="is-boxes">
                                <div class="is-box-img is-box is-box-6" style="background-color: rgb(247, 247, 247); background-image: linear-gradient(0deg, rgb(255, 208, 100), rgb(239, 98, 159));">
                                    <div class="is-boxes ">
                                        <div class="is-overlay">
                                            <div class="is-overlay-bg" style="background-image: url(&quot;uploads/travel.png&quot;); background-position: 50% 60%; transform: translateY(-0.0631912px) scale(1.05);" data-bottom-top="transform:translateY(-120px) scale(1.05);" data-top-bottom="transform:translateY(120px) scale(1.05)"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="is-box is-dark-text is-bg-light is-box-6">
                                    <div class="is-boxes">
                                        <div class="is-box-centered">
                                            <div class="is-container container" style="max-width: 480px;">
                                                <div class="row clearfix">
                                                    <div class="column full right">
                                                        <div class="display">
                                                            <h1 class="size-72">A Little Story</h1>
                                                        </div>
                                                        <p style="border-bottom: 3px solid #333; width: 80px; display: inline-block;"></p>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="column full">
                                                        <div class="spacer height-40"></div>
                                                    </div>
                                                </div>
                                                <div class="row clearfix">
                                                    <div class="column full">
                                                        <p style="text-align: justify;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        mainCss = '';
                        sectionCss = '';
                    }
                    obj.value.loadStyles(mainCss, sectionCss);
                    obj.value.loadHtml(html);

                    // Add required scripts for viewing the content
                    addExternalScripts('box/box-flex.js');
                });
            });
        })
        onBeforeUnmount(() => {
            return obj.value.destroy()
        })
        const save = (callback) => {
            // Save all embedded base64 images first
            obj.value.saveImages('', ()=>{

                // Then save the content
                let html = obj.value.html();
                let mainCss = obj.value.mainCss(); //mainCss() returns the default typography style.
                let sectionCss = obj.value.sectionCss(); //sectionCss returns typography styles applied for specific sections.
                const data = {
                    html: html,
                    mainCss: mainCss,
                    sectionCss: sectionCss,
                };
        
                axios.post('/save', data).then((response)=>{
                    // Saved Successfully
                    if(callback) callback(html, mainCss, sectionCss);
                }).catch((err)=>{
                    console.log(err);
                });
            }, (img, base64, filename)=>{
                // Upload image process for base64 images
                axios.post('/upload', { image: base64, filename: filename }).then((response)=>{
                    const uploadedImageUrl = response.data.url; // get saved image url
                    img.setAttribute('src', uploadedImageUrl); // set image src
                }).catch((err)=>{
                    console.log(err)
                });
            });
        }
        return { 
            save
        }
    }
}
</script>