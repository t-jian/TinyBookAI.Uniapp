<script>
	export default {
		globalData: {
			userInfo: null,
			imgItems:[],
			content:'',
			titleItems:[],
			exUrlItems:[],
			clipboard:'',
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
		/*每个页面公共css */
		@import '@/uni_modules/uni-scss/index.scss';
		@import "@/static/css/iconfont.css";
	.u-slide-up-enter-active{
		position: fixed;
		display: flex;
	}
</style>
