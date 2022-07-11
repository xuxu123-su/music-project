import musicPlary from '../../utils/plarymusic'
import {playerStore} from '../../store/index'

Component({
    properties: {
        item: {
            type: Object,
            value: {}
        },
    },
 
    data: {
        iconUrl: 'https://clc-1253185145.cos.ap-guangzhou.myqcloud.com/clc/d2c59ad2-5335-4bcd-8dc3-c83e756dd651.png'
    },

    methods: {
        songClick() {
            const id = this.properties.item.id
            musicPlary(id)
            playerStore.dispatch('playMusicAction', {id})
        }
    },
})
