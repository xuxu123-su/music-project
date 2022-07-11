import musicPlary from '../../utils/plarymusic'
import { playerStore } from '../../store/index'

Component({
    properties: {
        item: {
            type: Object,
            value: {}
        }
    },

    data: {

    },

    methods: {
        songClick() {
            const id = this.properties.item.id
            musicPlary(id)
            // 对歌曲数据请求和其他操作
            playerStore.dispatch('playMusicAction', { id })
        }
    }
})
