<template>
  <div id="app" style="height:100%">
    <Editable ref="childRef" />
  </div>
    <div className="is-ui" style="position:fixed;right:30px;bottom:30px;display:flex">
        <button type="button" @click="saveContent" style="width:85px;">Save</button>
        <button type="button" @click="saveContentAndFinish" style="width:120px;">Save & Finish</button>
        <button type="button" @click="closeBuilder" style="width:85px;">Close</button>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Editable from '../components/Editable.vue';

export default {
    components: { Editable },
    setup() {
        const router = useRouter()
        const childRef = ref()
        
        const saveContent = () => {
            childRef.value.save((html, mainCss, sectionCss) => {
                // Saved
            })
        }
        const saveContentAndFinish = () => {
            childRef.value.save((html, mainCss, sectionCss) => {
                // Saved
                router.push('/')
            })
        }
        const closeBuilder = () => {
            const answer = window.confirm('Do you really want to leave?')
            if (!answer) return false

            router.push('/')
        }
        return { 
            childRef,
            saveContent,
            saveContentAndFinish,
            closeBuilder
        }
    }
}
</script>