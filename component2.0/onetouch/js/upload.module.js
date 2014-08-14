(function (crmuploader) {
    var settings = {
        uploadElem: '.ui-upload',
        pluginId: 'onetouch',
        namespace: 'onetouch',
        globalId: '',
        photoObj: '',
        uploadPic: {
            service: 'FormBizService',
            method: 'takePhoto'
        },
        showPic: {
            service: 'CommonService',
            method: 'showPhoto'
        },
        deletePic: {
            service: 'FormBizService',
            method: 'deleteLocalPhoto'
        },
        scrollObj: '',
        template: '<div class="ui-upload-item"><a href="javascript:;" class="ui-upload-img" data-id="{pic_id}" data-type="{pic_type}" data-src="{img_url_path}"><img src="{img_url_show}" alt="" /></a><p class="{upload_status}">{upload_text}</p></div>'
    }, root = this;

    this.init = function (options) {
        console.log(options);
        root.settings = $.extend(settings, options);
        console.log(root.settings);

        initEvent();
    }, initEvent = function () {
        $(root.settings.uploadElem).delegate('.ui-upload-item', 'tap', function () {
            var cell = $(this);

            if (cell.hasClass('ui-upload-item-plus')) {
                _uploadPic(cell);
            } else {
                _showPic(cell);
            }
        }).delegate('.ui-upload-item', 'longtap', function (event) {
            var cell = $(this);

            if (!cell.hasClass('ui-upload-item-plus')) {
                _deletePic(cell);
            }
        });
    }, _uploadPic = function (obj) {
        var fileType = obj.parents('.ui-upload').attr('data-type');

        window.WindVane.call(root.settings.uploadPic.service, root.settings.uploadPic.method, {
            "photoType": fileType,
            "namespace": root.settings.namespace,
            "pluginId": root.settings.pluginId,
            "globalId": root.settings.globalId
        }, function success(json) {
            var picData = {};
            picData.fileId = '';
            picData.fileType = json.result.photoType;
            picData.isDeleted = 'n';
            picData.showUri = json.result.showUri;
            picData.srcPath = json.result.srcPath;
            picData.uploadStatus = '';
            picData.uploadText = '未上传';

            _loadingPic(obj, picData);

            // return new pic obj
            root.settings.photoObj.push(picData);
        });
    }, _loadingPic = function (obj, data) {
        var tempItem = root.settings.template;

        tempItem = tempItem.replace(/{pic_id}/g, data.fileId)
            .replace(/{pic_type}/g, data.fileType)
            .replace(/{img_url_path}/g, data.srcPath)
            .replace(/{img_url_show}/g, data.showUri)
            .replace(/{upload_status}/g, data.uploadStatus)
            .replace(/{upload_text}/g, data.uploadText);
        obj.before(tempItem);
        obj.hide();
        root.settings.scrollObj.refresh();
    }, _showPic = function (obj) {
        window.WindVane.call(root.settings.showPic.service, root.settings.showPic.method, {
            "imgUrl": obj.children('a').attr('data-src').replace('_100x100.jpg', ''),
            "cacheKey": obj.children('a').attr('data-id')
        });
    }, _deletePic = function (obj) {
        window.WindVane.call('UIService', 'confirm', {
            'title': '删除照片',
            'msg': '删除操作不可逆，你确认删除该照片？'
        }, function success(ret) {
            if (ret.result.ok) {
                var fileId = obj.children('a').attr('data-id'), fileType = obj.children('a').attr('data-type'), fileShowUri = obj.find('img').attr('src'), fileSrcPath = obj.children('a').attr('data-src');

                // 线上图片，记录，保存后删除；本地图片，直接删除
                if (fileId) {
                    var deleteObj = {};
                    deleteObj.fileId = fileId;
                    deleteObj.fileType = fileType;
                    deleteObj.isDeleted = 'y';
                    deleteObj.showUri = fileShowUri;
                    deleteObj.srcPath = fileSrcPath;

                    root.settings.photoObj.push(deleteObj);
                } else {
                    window.WindVane.call(root.settings.deletePic.service, root.settings.deletePic.method, {
                        "namespace": root.settings.namespace,
                        "pluginId": root.settings.pluginId,
                        "globalId": root.settings.globalId,
                        "showUri": fileShowUri,
                        "photoType": fileType,
                        "srcPath": fileSrcPath
                    });

                    var newPicData = root.settings.photoObj;
                    for (var i = 0; i < newPicData.length; i++) {
                        if (newPicData[i] && newPicData[i].srcPath == fileSrcPath) {
                            delete newPicData[i];
                        }
                    }
                }
                obj.next().show();
                obj.remove();
                root.settings.scrollObj.refresh();
            }
        });
    };

    crmuploader.init = function (options) {
        root.init(options);
    }
})(window.crmuploader || (crmuploader = {}));