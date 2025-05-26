// the logic with `makeSDKTable(xml)` and related methods have been moved to https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.js,
// file which is loaded only on this page https://developer.digitalturbine.com/hc/en-us/articles/360010077777-Supported-Networks

hljs.initHighlightingOnLoad();

var HC_SETTINGS = {
        css: {
            activeClass: 'is-active',
            hiddenClass: 'is-hidden'
        }
    },
    currentHost = window.location.host,
    xml = loadXMLDoc("https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.xml");

$(function () {
    var $topbar = $('[data-topbar]');
    var $heroUnit = $('[data-hero-unit]');
    var $topSearchBar = $('.topbar__search-bar');
    var $topSearchBarQuery = $topSearchBar.find('#query');
    var $topSearchBarBtn = $('.topbar__btn-search');

    if (LotusUtils.isHomePage()) {
        $topbar.addClass('topbar--large');
        $topbar.removeClass('loading');
        $heroUnit.removeClass(HC_SETTINGS.css.hiddenClass);
        $('[data-wave-large]').removeClass(HC_SETTINGS.css.hiddenClass);
    } else {
        $topbar.addClass('topbar--small');
        $topbar.removeClass('loading');
        $('[data-wave-small]').removeClass(HC_SETTINGS.css.hiddenClass);
    }

    $topbar.removeClass(HC_SETTINGS.css.hiddenClass);
    $(window).trigger('resize');


    $('[data-toggle-menu]').click(function () {
        $(this).toggleClass('is-active');
        $('[data-menu]').toggle();
    });

    // Social share popups
    $('.share a').click(function (e) {
        e.preventDefault();
        window.open(this.href, '', 'height = 500, width = 500');
    });

    // Toggle the share dropdown in communities
    $('.share-label').on('click', function (e) {
        e.stopPropagation();
        var isSelected = this.getAttribute('aria-selected') == 'true';
        this.setAttribute('aria-selected', !isSelected);
        $('.share-label')
            .not(this)
            .attr('aria-selected', 'false');
    });

    $(document).on('click', function () {
        $('.share-label').attr('aria-selected', 'false');
    });

    // Submit requests filter form in the request list page
    $(
        '#request-status-select, #request-organization-select'
    ).on('change', function () {
        search();
    });

    // Submit requests filter form in the request list page
    $('#quick-search').on('keypress', function (e) {
        if (e.which === 13) {
            search();
        }
    });

    function search() {
        window.location.search = $.param({
            query: $('#quick-search').val(),
            status: $('#request-status-select').val(),
            organization_id: $('#request-organization-select').val()
        });
    }

    // Submit organization form in the request page
    $('#request-organization select').on('change', function () {
        $('#request-organization').submit();
    });

    $('.image-with-lightbox').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-with-zoom', // class to remove default margin from left and right side
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
        }
    });

    $('.image-with-video-icon').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    $('.accordion__item-title').on('click', function () {
        var $title = $(this);
        $title.toggleClass('accordion__item-title--active');
        $title
            .parents('.accordion__item')
            .find('.accordion__item-content')
            .slideToggle();
    });

    $('.tabs-link').click(function (e) {
        e.preventDefault();
        var $link = $(this);
        var tabIndex = $link.index();
        var $tab = $link
            .parents('.tabs')
            .find('.tab')
            .eq(tabIndex);
        $link
            .addClass(HC_SETTINGS.css.activeClass)
            .siblings()
            .removeClass(HC_SETTINGS.css.activeClass);
        $tab
            .removeClass(HC_SETTINGS.css.hiddenClass)
            .siblings('.tab')
            .addClass(HC_SETTINGS.css.hiddenClass);
    });

    // Fix animated icons
    $('.fa-spin').empty();

    $("img.custom-block__image").each(function () {
        var $img = $(this);
        var imgID = $img.attr("id");
        var imgClass = $img.attr("class");
        var imgURL = $img.attr("src") + "?reset";

        $.get(
            imgURL,
            function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find("svg");

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== "undefined") {
                    $svg = $svg.attr("id", imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== "undefined") {
                    $svg = $svg.attr("class", imgClass + " replaced-svg");
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr("xmlns:a");

                // Replace image with new SVG
                $img.replaceWith($svg);
            },
            "xml"
        );
    });

    // get_footer();//Get dynamic footer from https://www.digitalturbine.com/

    //#region XML file helpers

    // click on a tr from the tableFromXML to check/uncheck the input
    $(document).on('click', '.tableFromXML table tbody tr', function (e) {
        var $this = $(e.target);
        if (e.target.type !== 'checkbox' && e.target.tagName.toLowerCase() !== 'a' && !($this.parents('a').length > 0)) {
            var input = $this.closest('tr').find('[type="checkbox"]', this);
            input.trigger('click');
        }
    });

    $(document).on('click', '.tableFromXML .button-copy', function (e) {
        var $this = $(e.target),
            textarea = $this.parents('.card').find('textarea');
        dataUnderTableCopyConfiguration(textarea);
    });

    $(document).on('click', '.resetTableFromXML', function (e) {
        var $this = $(e.target),
            parent = $this.parents('.tableFromXML');
        parent.find('[type="checkbox"]:checked').prop('checked', false); // Uncheck it
    });

    //#region showButtonFromXML
    var showButtonFromXML = $('.showButtonFromXML'),
        showButtonFromNewXML = $('.showButtonFromNewXML'),
        skd_parent = $('.infoFromXML'),
        sdk_checkbox = skd_parent.find('input[name=sdk_agreement]');

    getButtonFromXML(showButtonFromXML, xml);
    if (showButtonFromNewXML.length > 0) {
        var xml_new_download_buttons = loadXMLDoc('https://cdn2.inner-active.mobi/fmp-sdk/ia.xml');
        //var xml_new_download_buttons = loadXMLDoc('https://documentation.fyber.com/dev_portal-ia_xml.php'); // workaround - getting the ia.xml file via PHP where the proper headers were set in order to get rid of the CORS errors
        getButtonFromNewXML(showButtonFromNewXML, xml_new_download_buttons);
    }

    $(document).on('change', sdk_checkbox, function (e) {
        var $this = $(e.target),
            sdk_button = $this.parents('.infoFromXML').find('.sdk_download_button');
        if ($this.is(':checked')) {
            // Checkbox is checked..
            //console.log('Checkbox is checked', sdk_checkbox);
            sdk_button.removeClass('disabled');

        } else {
            // Checkbox is not checked..
            //console.log('Checkbox is not checked', sdk_checkbox);
            sdk_button.addClass('disabled');

        }
    });
    //#endregion

    $('.card textarea').change();
    //#endregion

    //#region marketplaceVersions helpers
    marketplaceVersionsCreate();

    $(document).on('click', '.marketplaceVersions .tablink', function (e) {
        var $this = $(e.target),
            platform = $this.data('id');
        $this.parents('.marketplaceVersions').find('.tablink').removeClass('active');
        $this.addClass('active');
        $this.parents('.marketplaceVersions').find('[data-platform]').addClass('hidden');
        $this.parents('.marketplaceVersions').find('[data-platform="' + platform + '"]').removeClass('hidden');
    });
    //#endregion

    //#region marketplaceMediationVersions helpers
    // Supported DT Exchange SDKs by Mediation Platform
    // https://developer.digitalturbine.com/hc/en-us/articles/360015536857-Supported-DT-Exchange-SDKs-by-Mediation-Platform
    marketplaceMediationVersionsCreate();

    $(document).on('click', '.marketplaceMediationVersions .tablink', function (e) {
        var $this = $(e.target),
            platform = $this.data('id');
        $this.parents('.marketplaceMediationVersions').find('.tablink').removeClass('active');
        $this.addClass('active');
        $this.parents('.marketplaceMediationVersions').find('[data-platform]').addClass('hidden');
        $this.parents('.marketplaceMediationVersions').find('[data-platform="' + platform + '"]').removeClass('hidden');
    });
    //#endregion

    //#region Digital Turbine - footer mobile clickable with-children elements
    $(document).on('click', '#menu-footer-menu-mobile .menu-item-has-children > a', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const parent = $(this).parents('.menu-item-has-children');
        if (parent.hasClass("active")) {
            parent.removeClass('active');
        } else {
            $('#menu-footer-menu-mobile .menu-item-has-children').removeClass('active');
            parent.addClass('active');
        }
    });
    //#endregion

});

$(window).resize(function () {
    // console.log('document resized');
    mobile_menu_footer_adjust();
});

//#region Get dynamic footer from fyber.com
// function get_footer() {
    // $.get('https://www.digitalturbine.com/footer.html', function (data) {
       // var $content = $('<div />').html(data),
          // footer = $('body > footer');
        // console.log('Footer - Load was performed.');
        // footer.removeClass('footer container').html('');
        // $content.find('footer').appendTo(footer);
        // mobile_menu_footer_adjust();
    // });
// }

function mobile_menu_footer_adjust() {
    if (window.matchMedia("(max-width: 850px)").matches) {
        $('#menu-footer-menu').children().addClass('footer__block');
        $('.menu-item-has-children a:first-child').addClass('footer__open');
        $('.menu-item-has-children li a:first-child').removeClass('footer__open');

        $('.footer__block').click(function (e) {
            e.stopImmediatePropagation();
            $(this).siblings().children(".sub-menu").hide();
            // $(this).find(".sub-menu").toggle();
            $(this).siblings().children(".footer__open").removeClass('footer__rotate');
            $(this).siblings().removeClass('footer__opencolor');
            $(this).toggleClass('footer__opencolor');
            $(this).find(".footer__open").toggleClass('footer__rotate');
            $(this).find(".sub-menu").slideToggle();
        });
    } else {
        $('#menu-footer-menu').children().removeClass('footer__block').off();
        $('.menu-item-has-children a:first-child').removeClass('footer__open');
        $('.menu-item-has-children').children(".sub-menu").show();
    }
}

//#endregion

//#region XML file helpers

function dataUnderTableCopyConfiguration(textarea) {
    if (textarea.val()) {
        textarea.select();
        document.execCommand('copy');
    }
} // copyConfiguration()

//#endregion

//#region showButtonFromXML - helper functions
function getButtonFromXML(showButtonFromXML, xml) {
    if (typeof xml == 'undefined') {
        xml = loadXMLDoc("https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.xml");
    }
    if (showButtonFromXML.length > 0) {
        var xmlPlatforms = xml.getElementsByTagName("platforms");
        /*
        console.log(
            '\r\n typeof xml', typeof xml, // should be: object
            '\r\n xml', xml,
            '\r\n platforms: ', xmlPlatforms.length, '\r\n', xmlPlatforms,
            '\r\n'
        );
         */
        for (var btn = 0; btn < showButtonFromXML.length; btn++) {
            /*
             console.log(
             '\t\n length: ', showButtonFromXML.length,
             '\r\n btn: ', btn,
             '\r\n btn: ', showButtonFromXML[btn],
             '\r\n'
             );
             */
            var platform = $(showButtonFromXML[btn]).data('platform'),
                download_url = '',
                version = '',
                output = '';

            if (platform.length > 0) {
                download_url = $(xmlPlatforms).find('#' + platform).attr('download-url');
                version = $(xmlPlatforms).find('#' + platform).attr('version');

                if (download_url) {
                    var data = {};
                    data.url = download_url;
                    data.version = version;
                    data.platform = platform;
                    data.agreement_text = $(showButtonFromXML[btn]).data('agreement-text');
                    data.agreement_text_url = $(showButtonFromXML[btn]).data('agreement-text-for-url');
                    data.agreement_url = $(showButtonFromXML[btn]).data('agreement-url');
                    output = outputForDownloadSDK(data);
                    $(showButtonFromXML[btn]).after(output);
                    $(showButtonFromXML[btn]).remove();
                }
            }
        }
    }
}

function getButtonFromNewXML(showButtonFromXML, xml) {
    if (typeof xml === 'undefined' || xml === '') {
        return;
    }
    if (showButtonFromXML.length > 0) {
        var xmlPlatforms = xml.getElementsByTagName("platforms");
        /*
        console.log(
            '\r\n typeof xml', typeof xml, // should be: object
            '\r\n xml', xml,
            '\r\n platforms: ', xmlPlatforms.length,
            '\r\n', xmlPlatforms,
            '\r\n'
        );
        */
        for (var btn = 0; btn < showButtonFromXML.length; btn++) {
            /*
            console.log(
                '\r\n length: ', showButtonFromXML.length,
                '\r\n btn: ', btn,
                '\r\n btn: ', showButtonFromXML[btn],
                '\r\n'
            );
             */
            var platform = $(showButtonFromXML[btn]).data('platform'),
                download_url = '',
                version = '',
                output = '';

            if (platform.length > 0) {
                download_url = $(xmlPlatforms).find('#' + platform).find('sdks sdk download-url').text();
                version = $(xmlPlatforms).find('#' + platform).find('sdks sdk version').text();
                /*
                console.log(
                    '\r\n platform: ', platform,
                    '\r\n $(showButtonFromXML[btn]): ', $(showButtonFromXML[btn]),
                    '\r\n download_url: ', download_url,
                    '\r\n version: ', version,
                );
                */
                if (download_url) {
                    var data = {};
                    data.url = download_url;
                    data.version = version;
                    data.platform = platform;
                    data.agreement_text = $(showButtonFromXML[btn]).data('agreement-text');
                    data.agreement_text_url = $(showButtonFromXML[btn]).data('agreement-text-for-url');
                    data.agreement_url = $(showButtonFromXML[btn]).data('agreement-url');
                    output = outputForDownloadSDK(data, true);
                    $(showButtonFromXML[btn]).after(output);
                    $(showButtonFromXML[btn]).remove();
                }
            }
        }
    }
}

function outputForDownloadSDK(data, noVersionText) {
    var output = '';
    noVersionText = typeof noVersionText === 'undefined' ? false : noVersionText;
    //console.log(data);

    if (!$.isEmptyObject(data)) {
        output += '<div class="infoFromXML" data-platform="' + data.platform + '">'
            + '<p>'
            + '<a href="javascript:void(0)" onclick="window.location.href=\'' + data.url + '\';"'
            + ' class="sdk_download_button green disabled" data-version="' + data.version + '">'
            + '<i class="sdk-icon-arrow"></i> SDK ' + (noVersionText ? '' : 'v') + data.version
            + '</a>'
            + '</p>'
            + '<p>'
            + '<label class="checkbox">'
            + '<input class="sdk_agreement" name="sdk_agreement" type="checkbox">' + (data.agreement_text ? ' ' + data.agreement_text.trim() + ' ' : ' By downloading and/or using this SDK I hereby agree to the ')
            + (data.agreement_url ? '<a href="' + data.agreement_url.trim() + '" target="_blank">' : '')
            + (data.agreement_text_url ? data.agreement_text_url.trim() : 'SDK License Agreement')
            + (data.agreement_url ? '</a>' : '')
            + '</label>'
            + '</p>'
            + '</div>';
    }

    return output;
}

//#endregion

/*code for dynamically loading xml*/
function loadXMLDoc(dname) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send("");
    return xhttp.responseXML;
}

//#endregion

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
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

$(function () {
    let tab = getUrlParameter('tab');
    if (tab) {
        $("#" + tab).click();
        let header = $($(location).attr('hash'));
        $('html,body').animate({scrollTop: $(header).offset().top}, 'slow');
        console.log(tab, header)
    }
})

//#endregion

/*copy code feature*/
$(function () {
    var CopyCode = {
        init: function () {
            this.bindEvents();
            this.addCopyCodeBtn();
        },
        addCopyCodeBtn: function () {
            $('pre code:first-of-type').each((i, el) => {
                $('<button class="lt-copy-code" data-copy-code><span></span></button>').insertBefore($(el));
            });
        },
        bindEvents: function () {
            $(document).on('click', '[data-copy-code]', this.handleClick.bind(this));
        },
        handleClick: function (e) {
            const codeHtmlEl = $(e.target).next('code').text();
            this.copyTextToClipboard(codeHtmlEl);
        },
        fallbackCopyTextToClipboard: function (text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'successful' : 'unsuccessful';
                console.log(`Fallback: Copying text command was ${msg}`);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        },
        copyTextToClipboard: function (text) {
            if (!navigator.clipboard) {
                this.fallbackCopyTextToClipboard(text);
                return;
            }
            navigator.clipboard.writeText(text).then(
                () => {
                    console.log('Async: Copying to clipboard was successful!');
                },
                (err) => {
                    console.error('Async: Could not copy text: ', err);
                },
            );
        },
    };
    CopyCode.init();

});
