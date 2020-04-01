// 打开选取图片，获取图片临时路径
export function getImgPath(num = 1, sourceType = ["album", "camera"], sizeType = ['original']) {
	return new Promise((resolve, reject) => {
	  wx.chooseImage({
		count: num, //最大图片数量=最大数量-临时路径的数量
		sizeType, //图片尺寸 original--原图；compressed--压缩图
		sourceType, //选择图片的位置 album--相册选择, 'camera--使用相机
		success: res => {
		  resolve(res.tempFilePaths) //返回选择的图片临时地址数组，
		},
		fail(err) {
		  wx.showToast({
			title: '图片选择失败，请重试！',
			icon: 'none'
		  })
		  reject(err)
		}
	  });
	})
  }
// 临时路径转base64图片
export function pathToBase64(path) {
	return new Promise(function(resolve, reject) {
		if (typeof window === 'object' && 'document' in window) {
			var canvas = document.createElement('canvas')
			var c2x = canvas.getContext('2d')
			var img = new Image
			img.onload = function() {
				canvas.width = img.width
				canvas.height = img.height
				c2x.drawImage(img, 0, 0)
				resolve(canvas.toDataURL())
			}
			img.onerror = reject
			img.src = path
			return
		}
		if (typeof plus === 'object') {
			var bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
			bitmap.load(path, function() {
				try {
					var base64 = bitmap.toBase64Data()
				} catch (error) {
					reject(error)
				}
				bitmap.clear()
				resolve(base64)
			}, function(error) {
				bitmap.clear()
				reject(error)
			})
			return
		}
		// 微信
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			wx.getFileSystemManager().readFile({
				filePath: path,//选择图片返回的相对路径
				encoding: 'base64', //编码格式
				success: function(res) {
					resolve('data:image/png;base64,' + res.data.toString())
				},
				fail: function(error) {
					wx.showToast({
					  title: '上传图片失败，请重试！',
					  icon: 'none'
					})
					reject(error)
				}
			})
			return
		}
		reject(new Error('not support'))
	})
}

export function base64ToPath(base64) {
	return new Promise(function(resolve, reject) {
		if (typeof window === 'object' && 'document' in window) {
			base64 = base64.split(',')
			var type = base64[0].match(/:(.*?);/)[1]
			var str = atob(base64[1])
			var n = str.length
			var array = new Uint8Array(n)
			while (n--) {
				array[n] = str.charCodeAt(n)
			}
			return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], {
				type: type
			})))
		}
		var extName = base64.match(/data\:\S+\/(\S+);/)
		if (extName) {
			extName = extName[1]
		} else {
			reject(new Error('base64 error'))
		}
		var fileName = Date.now() + '.' + extName
		if (typeof plus === 'object') {
			var bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
			bitmap.loadBase64Data(base64, function() {
				var filePath = '_doc/uniapp_temp/' + fileName
				bitmap.save(filePath, {}, function() {
					bitmap.clear()
					resolve(filePath)
				}, function(error) {
					bitmap.clear()
					reject(error)
				})
			}, function(error) {
				bitmap.clear()
				reject(error)
			})
			return
		}
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			var filePath = wx.env.USER_DATA_PATH + '/' + fileName
			wx.getFileSystemManager().writeFile({
				filePath: filePath,
				data: base64.replace(/^data:\S+\/\S+;base64,/, ''),
				encoding: 'base64',
				success: function() {
					resolve(filePath)
				},
				fail: function(error) {
					reject(error)
				}
			})
			return
		}
		reject(new Error('not support'))
	})
}



