<template>
    <router-link class="edit" to="/edit">Edit</router-link>

    <div class="is-wrapper"></div>
</template>


<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {addExternalScripts, addExternalStyles, renderHtml, renderStyles} from './util'

export default {
    props: {
        html: String
    },
    setup() {
        
        onMounted(() => {
            
            // Load content from the server
            axios.get('/load').then((response)=>{
                
                let html, mainCss, sectionCss;

                if(response.data.html) {

                    html = response.data.html;
                    mainCss = response.data.mainCss;
                    sectionCss = response.data.sectionCss;

                } else {  //  If server returns empty (initial start), then load sample content.

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

                // Render html content
                renderHtml(html); 

                // Render Styles
                renderStyles(mainCss, sectionCss); // this appends the styles into head

                // Add required scripts
                addExternalScripts('box/box-flex.js'); //Re-run after rendering content

                // Show
                const wrapper = document.querySelector('.is-wrapper');
                wrapper.style.opacity = 1;

            });
            
        })

        return { 
            
        }
    }
}
</script>

<style scoped>
.edit {
    position: fixed;
    top:15px;
    right: 30px;
    z-index:1;
}
</style>