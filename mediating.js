//#region marketplaceVersions helpers // Supported Marketplace Versions - Mediated Platforms
function marketplaceVersionsCreate(currentPlatform) {
    // var marketplaceVersions = { // Supported Marketplace Versions - Mediated Platforms
    //     android: 'https://inneractive-assets.s3-eu-west-1.amazonaws.com/Vulcan/AndroidVerIndexer.json',
    //     ios: 'https://inneractive-assets.s3-eu-west-1.amazonaws.com/Vulcan/IOSVerIndexer.json'
    // };
    var marketplaceVersions = $('.marketplaceVersions');
    if (marketplaceVersions.length > 0) {
        marketplaceVersions.addClass('fyberTableDesign');
        var mvDataAttributes = marketplaceVersions.data(),
            mvPlatforms = {},
            mvColumnNames = {},
            buttonsOutput = '',
            bodyOutput = '',
            finalOutput = '';
        var hash = window.location.hash,
            platformFromHash;
        switch (hash) {
            case '#marketplace-android':
            case '#marketplace-ios':
            case '#marketplace-unity':
                var hashArr = hash.split("-");
                platformFromHash = hashArr[1];
                break;
            default:
                break;
        }
        currentPlatform = (typeof currentPlatform === 'undefined') ? ((typeof platformFromHash === 'undefined') ? 'android' : platformFromHash) : currentPlatform;
        currentPlatform = currentPlatform.toLowerCase();
        // Loop through data attributes to get the platforms(android/ios). The data attribute should start with data-page-* to be taken into consideration
        $.each(mvDataAttributes, function (key, value) {
            // Because each key is in camelCase,
            // we need to convert it to kabob-case and store it in attr.
            var attr = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (attr.startsWith('page-')) {
                mvPlatforms[attr.substring(5)] = value; // 'page-' has 5 chars so get the rest of the attr as the key for mvPlatforms
            } else if (attr.startsWith('column-')) {
                mvColumnNames[attr.substring(7)] = value; // 'column-' has 7 chars so get the rest of the attr as the key for mvColumnNames
            }
        });
        /*
        console.log(
            //     '\r\n', 'mvPlatforms: ', mvPlatforms,
            '\r\n', 'mvColumnNames: ', mvColumnNames,
            '\r\n', 'mvColumnNames name: ', mvColumnNames['name'],
            '\r\n', 'mvColumnNames version: ', mvColumnNames['version'],
        );
        */
        // Loop through mvPlatforms.

        //  getJSON Synchronous - Set the global configs to synchronous
        $.ajaxSetup({
            async: false
        });
        $.each(mvPlatforms, function (platform, url) {
            buttonsOutput += '<a href="#marketplace-' + platform + '">';
            buttonsOutput += '<button data-id="' + platform + '" class="tablink' + ((platform === currentPlatform) ? ' active' : '') + '">' + (platform === 'ios' ? 'iOS' : capitalizeFirstLetter(platform)) + '</button>';
            buttonsOutput += '</a>';
            $.getJSON(url, function (data) {
                // console.log('data: ', typeof data, data);
                $.each(data, function (key, val) {
                    bodyOutput += '<tr id="mv-' + key + '" data-platform="' + platform + '"' + ((platform !== currentPlatform) ? ' class="hidden"' : '') + '>'
                        + '<td class="icon-' + platform + '"><img src="https://storage.googleapis.com/gcs-exchange-public-useast1-prod/doc-portal-assets/' + platform + '-gray.png" alt="' + platform + '"></td>'
                        + '<td class="mv-adapter">' + key + '</td>'
                        + '<td class="mv-version">' + val + '</td>'
                        + '</tr>'
                    ;
                });
            });
            // console.log(
            //     '\r\n', 'platform: ', platform,
            //     '\r\n', 'url: ', url,
            //     '\r\n', 'bodyOutput: ', bodyOutput,
            // );
        });
        // getJSON Synchronous - Set the global configs back to asynchronous
        $.ajaxSetup({
            async: true
        });

        if ((bodyOutput !== '') || (buttonsOutput !== '')) {
            marketplaceVersions.find('.marketplaceVersion').remove();
            finalOutput += '<div class="marketplaceVersion">';
            finalOutput += ((buttonsOutput !== '') ? '<div class="tab">' + buttonsOutput + '</div>' : '');
            finalOutput += (
                (bodyOutput !== '')
                    ? ''
                    + '<table width="100%" align="center">'
                    + '<thead>'
                    + '<tr>'
                    + '<th class="icon-' + currentPlatform + '"><img src="https://storage.googleapis.com/gcs-exchange-public-useast1-prod/doc-portal-assets/' + currentPlatform + '-gray.png" alt="" style="visibility: hidden;"></th>'
                    + (typeof mvColumnNames['name'] !== 'undefined' ? '<th>' + mvColumnNames['name'] + '</th>' : '<th>Mediation Platform</th>')
                    + (typeof mvColumnNames['version'] !== 'undefined' ? '<th>' + mvColumnNames['version'] + '</th>' : '<th>Version</th>')
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + bodyOutput
                    + '</tbody>'
                    + '</table>'
                    : ''
            );
            finalOutput += '</div>';
            marketplaceVersions.append(finalOutput);
        }
    }
}

function marketplaceMediationVersionsCreate(currentPlatform) {
    // var marketplaceMediationVersions = { // Supported Marketplace Versions - Mediated Platforms
    //     android: 'https://inneractive-assets.s3-eu-west-1.amazonaws.com/Vulcan/AndroidVerIndexer.json',
    //     ios: 'https://inneractive-assets.s3-eu-west-1.amazonaws.com/Vulcan/IOSVerIndexer.json'
    // };
    // https://documentation.fyber.com/mediations_list.xml
    var marketplaceMediationVersions = $('.marketplaceMediationVersions');
    if (marketplaceMediationVersions.length > 0) {
        marketplaceMediationVersions.addClass('fyberTableDesign');
        $.each(marketplaceMediationVersions, function (key, value) {
            let $this = $(this),
                mvDataAttributes = $this.data(),
                mvColumnNames = {},
                buttonsOutput = '',
                bodyOutput = '',
                finalOutput = '',
                url = '',
                file_type = 'json',
                hash = window.location.hash,
                platformFromHash;
            switch (hash) {
                case '#marketplace-android':
                case '#marketplace-ios':
                case '#marketplace-unity':
                    var hashArr = hash.split("-");
                    platformFromHash = hashArr[1];
                    break;
                default:
                    break;
            }
            currentPlatform = (typeof currentPlatform === 'undefined') ? ((typeof platformFromHash === 'undefined') ? 'android' : platformFromHash) : currentPlatform;
            currentPlatform = currentPlatform.toLowerCase();
            // Loop through data attributes to get the platforms(android/ios). The data attribute should start with data-page-* to be taken into consideration
            $.each(mvDataAttributes, function (key, value) {
                // Because each key is in camelCase,
                // we need to convert it to kabob-case and store it in attr.
                const attr = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                if (attr === 'url') {
                    url = value;
                } else if (attr === 'file-type') {
                    file_type = value;
                } else if (attr.startsWith('column-')) {
                    mvColumnNames[attr.substring(7)] = value; // 'column-' has 7 chars so get the rest of the attr as the key for mvColumnNames
                }
            });
            /*
            console.log(
                '\r\n', 'file_type: ', file_type,
                '\r\n', 'url: ', url,
                '\r\n', 'mvColumnNames: ', mvColumnNames,
                '\r\n', 'mvColumnNames name: ', mvColumnNames['name'],
                '\r\n', 'mvColumnNames version: ', mvColumnNames['version'],
            );
            */

            if (url && url !== '') {
                //  getJSON Synchronous - Set the global configs to synchronous
                $.ajaxSetup({
                    async: false
                });
                if (file_type === 'json') {
                    $.getJSON(url, function (mvPlatforms) {
                        // console.log('getJSON mvPlatforms: ', typeof mvPlatforms, mvPlatforms);
                        $.each(mvPlatforms, function (platform, data) {
                            // console.log('\r\n$this: ', $this, '\r\nplatform: ', platform, '\r\ndata: ', data);
                            buttonsOutput += '<a href="#marketplace-' + platform + '">';
                            buttonsOutput += '<button data-id="' + platform + '" class="tablink' + ((platform === currentPlatform) ? ' active' : '') + '">' + (platform === 'ios' ? 'iOS' : capitalizeFirstLetter(platform)) + '</button>';
                            buttonsOutput += '</a>';
                            $.each(data, function (key, adapter) {
                                // console.log('\r\nkey: ', key, '\r\nadapter: ', adapter);
                                bodyOutput += '<tr id="mv-' + platform + '-' + key + '" data-platform="' + platform + '"' + ((platform !== currentPlatform) ? ' class="hidden"' : '') + '>'
                                    + '<td class="icon-' + platform + '"><img src="https://storage.googleapis.com/gcs-exchange-public-useast1-prod/doc-portal-assets/' + platform + '-gray.png" alt="' + platform + '"></td>'
                                    + '<td class="mv-adapter">' + adapter.name + '</td>'
                                    + '<td class="mv-version">' + adapter.version + '</td>'
                                    + '<td class="mv-waterfall center">' + getMediationIconsCell(adapter.waterfall) + '</td>'
                                    + '<td class="mv-bidding center">' + getMediationIconsCell(adapter.bidding) + '</td>'
                                    + '</tr>'
                                ;
                            });
                            // console.log(
                            //     '\r\n', 'platform: ', platform,
                            //     '\r\n', 'url: ', url,
                            //     '\r\n', 'bodyOutput: ', bodyOutput,
                            // );
                        });
                    });
                } else {
                    // $.get(url, function (mvPlatforms) {
                    //     console.log('XML mvPlatforms: ', typeof mvPlatforms, mvPlatforms);
                    // });
                    // loadXmlContent("https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.xml");
                }
                // getJSON Synchronous - Set the global configs back to asynchronous
                $.ajaxSetup({
                    async: true
                });

                if ((bodyOutput !== '') || (buttonsOutput !== '')) {
                    $this.find('.marketplaceVersion').remove();
                    finalOutput += '<div class="marketplaceVersion">';
                    finalOutput += ((buttonsOutput !== '') ? '<div class="tab">' + buttonsOutput + '</div>' : '');
                    finalOutput += (
                        (bodyOutput !== '')
                            ? ''
                            + '<table width="100%" align="center">'
                            + '<thead>'
                            + '<tr>'
                            + '<th rowspan="2" class="icon-' + currentPlatform + '"><img src="https://storage.googleapis.com/gcs-exchange-public-useast1-prod/doc-portal-assets/' + currentPlatform + '-gray.png" alt="" style="visibility: hidden;"></th>'
                            + (typeof mvColumnNames['name'] !== 'undefined' ? '<th rowspan="2">' + mvColumnNames['name'] + '</th>' : '<th rowspan="2">Mediation Platform</th>')
                            + (typeof mvColumnNames['version'] !== 'undefined' ? '<th rowspan="2">' + mvColumnNames['version'] + '</th>' : '<th rowspan="2">Version</th>')
                            + '<th colspan="2" class="center">Supported Ad Types</th>'
                            + '</tr>'
                            + '<tr>'
                            + (typeof mvColumnNames['waterfall'] !== 'undefined' ? '<th class="center">' + mvColumnNames['waterfall'] + '</th>' : '<th class="center">Waterfall</th>')
                            + (typeof mvColumnNames['bidding'] !== 'undefined' ? '<th class="center">' + mvColumnNames['bidding'] + '</th>' : '<th class="center">Bidding</th>')
                            + '</tr>'
                            + '</thead>'
                            + '<tbody>'
                            + bodyOutput
                            + '</tbody>'
                            + '</table>'
                            : ''
                    );
                    finalOutput += '</div>';
                    $this.append(finalOutput);
                }
            }
        });
    }
}

function getMediationIconSvg(adFormat) {
    if (adFormat.toLowerCase() === 'rewarded_video') {
        return `
            <svg focusable="false" viewBox="25 2 120 170" aria-hidden="true" style="height: 50px">
               <title>Rewarded Video</title>
               <rect x="43" y="7.55078" width="88.0001" height="160" rx="18" fill="#99C167" stroke="#251546" stroke-width="6" stroke-linejoin="round"/>
               <path d="M68.3524 76.4082L59.749 88.769C59.1715 89.5988 59.304 90.7291 60.0578 91.4028L85.741 114.356C86.5016 115.036 87.6518 115.035 88.4106 114.353L113.93 91.42C114.689 90.7384 114.813 89.5954 114.219 88.7668L105.339 76.3852C104.964 75.8614 104.358 75.5508 103.714 75.5508H86.845H69.9939C69.3394 75.5508 68.7263 75.871 68.3524 76.4082Z" stroke-width="4" stroke-linejoin="round" fill="white"/>
            </svg>
        `
    } else if (adFormat.toLowerCase() === 'interstitial') {
        return `
            <svg focusable="false" viewBox="25 2 120 170" aria-hidden="true" style="height: 50px">
               <title>Interstitial</title>
               <rect x="43" y="7.55078" width="88.0001" height="160" rx="18" fill="#99C167" stroke="#251546" stroke-width="6" stroke-linejoin="round"/>
               <path d="M73 23.5508H101" stroke-width="6" stroke-linecap="round"/>
            </svg>
        `
    } else if (adFormat.toLowerCase() === 'banner') {
        return `
            <svg focusable="false" viewBox="25 2 120 170" aria-hidden="true" style="height: 50px">
               <title>Banner</title>
               <rect x="43" y="7.55078" width="88.0001" height="160" rx="18" fill="#E0ECD1" stroke="#251546" stroke-width="6" stroke-linejoin="round"/>
               <path stroke="#251546" d="M73 23.5508H101" stroke-width="6" stroke-linecap="round"/>
               <rect fill="#99C167" x="54" y="132.551" width="66" height="24" rx="4"/>
            </svg>
        `
    } else if (adFormat.toLowerCase() === 'mrec') {
        return `
            <svg focusable="false" viewBox="25 2 120 170" aria-hidden="true" style="height: 50px">
               <title>MREC</title>
               <rect x="43" y="7.55078" width="88.0001" height="160" rx="18" fill="#E0ECD1" stroke="#251546" stroke-width="6" stroke-linejoin="round"/>
               <path stroke="#251546" d="M73 23.5508H101" stroke-width="6" stroke-linecap="round"/>
               <rect fill="#99C167" x="54" y="57.5508" width="66" height="55" rx="4"/>
            </svg>
        `
    }
    return ``
}

function getMediationIconsCell(data) {
    let output = '<div style="white-space: nowrap;">';
    const notSupportedFormat = '';
    if (inArray('rewarded_video', data)) {
        output += getMediationIconSvg('rewarded_video');
    } else {
        output += notSupportedFormat;
    }
    if (inArray('interstitial', data)) {
        output += getMediationIconSvg('interstitial');
    } else {
        output += notSupportedFormat;
    }
    if (inArray('banner', data)) {
        output += getMediationIconSvg('banner');
    } else {
        output += notSupportedFormat;
    }
    if (inArray('mrec', data)) {
        output += getMediationIconSvg('mrec');
    } else {
        output += notSupportedFormat;
    }
    output += '</div>';

    return output;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);