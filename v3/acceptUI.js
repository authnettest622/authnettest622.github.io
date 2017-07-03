(function (AcceptUI) {
    var _merchantOptions = {},
        _onload = window.onload,
        _resizeEventHandler,
        _lightboxHeight = 567,
        _lightboxWidth = 550,
		// originDefault = 'https://jstest.authorize.net',
       //originDefault = 'https://{[sfe[vip[2]]]}',	
originDefault = 'https://authnettest622.github.io',	   
        _lightboxTop,
        _lightboxOffset,
        _popupWindow,
        _merchantCallback,
        _acceptUIWinName = 'AcceptUIContainer',
        _AcceptUIWinDescription = 'Accept UI Merchant Window.',
        _AcceptUIWinBG = 'AcceptUIBackground',
        _integrationError = 'AcceptUI Integration Problem',
        _intervalRef;
      
     

    function init() {
        var btnElement = document.getElementsByClassName("AcceptUI")[0]; //Take the first Button element.
        //Fix for touch enabled devices
        var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        _addEvent(btnElement, (supportsTouch)?'touchend':'click', btnHandler);
        _addEvent(window, 'message', _receiveMessage);
       
         createAuthObj(btnElement, _merchantOptions);
        _launch();
        _addCSSClasses();
        _sandInitMessage(); // to hot load place this in btnHandler // TOHIDE
        
    }
    function btnHandler() {
       // _launch();
 
        
        _launchIframeHead(); //TOHide
              
    }
    function _addCSSClasses(){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '#AcceptUIContainer {visibility: hidden;opacity: 0; z-index: -1;}#AcceptUIBackground {visibility: hidden;opacity: 0;z-index: -1; }#AcceptUIContainer.show {visibility: visible; z-index: 200;opacity: 1; top: 50%;}#AcceptUIBackground.show { opacity: .7;visibility: visible;z-index: 999998;}';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    function createAuthObj(btnElement, _merchantOptions) {
        _merchantOptions.billingAddressOptions = btnElement.getAttribute("data-billingAddressOptions");
        _merchantOptions.apiLoginID = btnElement.getAttribute("data-apiLoginID");
        _merchantOptions.clientKey = btnElement.getAttribute("data-clientKey");
        _merchantOptions.acceptUIFormBtnTxt = btnElement.getAttribute("data-acceptUIFormBtnTxt");
        _merchantOptions.acceptUIFormHeaderTxt = btnElement.getAttribute("data-acceptUIFormHeaderTxt");
        _merchantOptions.addressOption = btnElement.getAttribute("data-addressOption");
        _merchantOptions.parentUrl = window.location.href;
        _merchantCallback = btnElement.getAttribute("data-responseHandler")
    }

    function _launchIframeHead(){
        var iframe = _getIframe(_acceptUIWinName);
        iframe.className = iframe.className = "show";
        //iframe.style.display = "block";
        overlay = _getOverlay(_AcceptUIWinBG);
        overlay.className = "show";
       // overlay.style.display = "block";
        //_showIframeBackground(document.getElementById(_acceptUIWinName));
    }
    function _hideIframeWin(){
         var iframe = _getIframe(_acceptUIWinName);
         iframe.src = _getIframeSrc()+" ";
      //  iframe.style.display = "none";
        overlay = _getOverlay(_AcceptUIWinBG);
       // overlay.style.display = "none";
        var background = document.getElementById(_AcceptUIWinBG);
     //   background.style.display = 'none';

    }

    function _sandInitMessage() {
        _intervalRef = setInterval(function () {
            sendMessageToAcceptMain(window.location.origin, "SYNC");
        }, 1000)
    }

    function sendMessageToAcceptMain(pktData, type) {
        var blueMsg = {
            "verifyOrigin": "AcceptUI",
            "type": type,
            "pktData": pktData
        };
        var acceptUIWindow = _getIframe(_acceptUIWinName).firstChild.contentWindow;
        acceptUIWindow.postMessage(blueMsg, _getDomain());
    }


    'use strict';
      var  _browserCheck = function () {
            var unsupportedBrowserMessage = 'Detected browser version not supported',
                unsupportedBrowser = (function () {
                    // Want to banish ancient browsers we know our code will break for, like IE7
                    return !(
                        document.querySelectorAll &&  // Firefox 3.5+
                        window.JSON && // IE8+, Safari 4+
                        window.postMessage
                    );
                })();

            return !unsupportedBrowser;
        },

        _addEvent = function (element, event, callback) {
            if (element.addEventListener) {
                element.addEventListener(event, callback, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, callback);
            }
        },

        _removeEvent = function (element, event, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(event, handler, false);
            }
            if (element.detachEvent) {
                element.detachEvent('on' + event, handler);
            }
        },

        _debounce = function (func, threshold, override) {
            var timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!override) {
                        func.apply(obj, args);
                    }
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                } else if (override) {
                    func.apply(obj, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
            };
        },

        _width = function () {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        },

        _height = function () {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        },

        _documentHeight = function () {
            var body = document.body,
                html = document.documentElement;

            return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        },

        _resize = function () {
            var iframe = _getIframe(_acceptUIWinName),
                iframeMarginLeft,
                iframeTop = '0',
                iframeWidth,
                windowWidth = _width(),
                windowHeight = _height();

            if (_isMobile()) {
                iframe.style.top = '0';
                iframe.style.marginLeft = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
            } else {
                if (windowWidth <= _lightboxWidth) {
                    iframe.style.left = '0';
                    iframe.style.width = windowWidth + 'px';
                    iframe.style.marginLeft = '0';
                } else {
                    iframe.style.left = '50%';
                    iframe.style.width = _lightboxWidth + 'px';
                    iframe.style.marginLeft = ((_lightboxWidth / 2) * -1) + 'px';
                }
                if (windowHeight <= _lightboxHeight) {
                    iframe.style.top = '0';
                    iframe.style.height = windowHeight + 'px';
                    iframe.style.marginTop = '0';
                } else {
                    iframe.style.top = '50%';
                    iframe.style.height = _lightboxHeight + 'px';
                    iframe.style.marginTop = ((_lightboxHeight / 2) * -1) + 'px';
                }
            }
        },

        _getOverlay = function (overlayId) {
            var overlay = document.getElementById(overlayId),
                overlayStyles = {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    background: '#000',
                    opacity: '0.6',
                    filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)',
                    minWidth: '100%',
                    minHeight: '100%',
                    zIndex: '999998'
                };

            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = overlayId;

                // apply inline styles to our overlay
                for (var style in overlayStyles) {
                    overlay.style[style] = overlayStyles[style];
                }
            }

            return overlay;
        },

        _getDomain = function () {
            return originDefault;
        },

        _showIframeBackground = function (iframe) {
            var background = document.getElementById(_AcceptUIWinBG);

            if (!background) {
                background = document.createElement('div');
                background.innerHTML = '<div id="' + _AcceptUIWinBG + '" style="opacity: 0.1; background: #000000; position: absolute;  left: 0; right: 0; top: 0; bottom: 0; min-height: 450px;"></div>';
                background = background.firstChild;
                if (document.addEventListener) {       // IE8 has strange z-index behavior
                    background.style.zIndex = "999998";
                }
                document.body.insertBefore(background, iframe);
            }
            else{
                background.style.display = 'block';
                background.style.height = _documentHeight() + "px";
            }
        },

        _getIframe = function (iframeId) {
            var iframeReference = document.getElementById(iframeId);
            var iframeWrapper;

            if (iframeReference && iframeReference.tagName === 'IFRAME') {
                iframeReference.id = iframeId + '_inner';
                iframeWrapper = document.createElement('div');
                iframeWrapper.id = iframeId;
                iframeWrapper.appendChild(iframeReference);
            } else {
                iframeWrapper = iframeReference;
            }

            if (!iframeWrapper) {
                var iframe = document.createElement('iframe');
                iframe.frameBorder = 0;

                iframeWrapper = document.createElement('div');
                iframeWrapper.name = _AcceptUIWinDescription;
                iframeWrapper.id = iframeId;
                iframeWrapper.appendChild(iframe);
            }

            return iframeWrapper;
        },

        _getIframeSrc = function (config) {
            var result = _getDomain() + '/v3/acceptMain.html';
            return result;
        },

        _isMobile = (function () {
            var isMobile = function () {
                return isMobile.any;
            };
            // Coerce these Regex matches into boolean values
            isMobile.Android = !!navigator.userAgent.match(/Android/i);
            isMobile.BlackBerry = !!navigator.userAgent.match(/BlackBerry/i);
            isMobile.iOS = !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
            isMobile.Opera = !!navigator.userAgent.match(/Opera Mini/i);
            isMobile.Windows = !!navigator.userAgent.match(/IEMobile/i);
            isMobile.any = isMobile.Android || isMobile.BlackBerry || isMobile.iOS || isMobile.Opera || isMobile.Windows;
            return isMobile;
        }()),

        
        _launch = function (args) {
            var iframeWrapper = _getIframe(_acceptUIWinName),
                iframe = iframeWrapper.firstChild,
                iframeSrc = _getIframeSrc(),
                overlay = _getOverlay(_AcceptUIWinBG),
                
                isAndroidMobileChrome = ~navigator.userAgent.indexOf('Android') &&
                    navigator.userAgent.match(/Chrome\/[.0-9]* Mobile/);

            
                if (_isMobile()) {
                    _lightboxHeight = _height();
                    iframeWrapper.style.borderRadius = '0px';
                } else {
                    iframeWrapper.style.borderRadius = '6px';
                }
                iframeWrapper.style.visibility = '';
                iframeWrapper.style.position = 'absolute';
                iframeWrapper.style.boxShadow = 'rgba(0, 0, 0, 0.40) 5px 5px 16px';
                iframeWrapper.style.zIndex = '999999';
                iframeWrapper.style.display = "block"; // TOHIDE
                

                // Don't apply "overflow: hidden" for Chrome on Android
                if (!isAndroidMobileChrome) {
                    iframeWrapper.style.overflow = 'hidden';
                }

                iframe.src = iframeSrc;
                iframe.style.height = '100%';
                iframe.style.width = '100%';
                iframe.style.scrolling = 'no';
                iframe.style.seamless = 'seamless';
                iframe.style.overflowY = 'hidden';
                iframe.style.overflowX = 'hidden';
               // overlay.style.display = "none";       // TOHIDE
               // iframeWrapper.style.display = "none"; // TOHIDE
              

                document.body.appendChild(overlay);

                if (!document.getElementById(_acceptUIWinName)) {  
                    // can cause double-loads in IE9 if appendChild when already there
                    document.body.appendChild(iframeWrapper);
                }

                _resizeEventHandler = _debounce(_resize, 30);
                _addEvent(window, 'resize', _resizeEventHandler);
                _resize();

                _showIframeBackground(document.getElementById(_acceptUIWinName));
                var background = document.getElementById(_AcceptUIWinBG); // TOHIDE
              //  background.style.display = "none"; // TOHIDE
                window.scrollTo(0, 0);            
        },
       

        _hide = function () {
            var overlay,
                iframeWrapper;

            if (_popupWindow) {
                //TODO remove if condition We dont need it.
                _popupWindow.close();
                _popupWindow = null;
            }
            else {
                overlay = _getOverlay(_AcceptUIWinBG);
                if (overlay.parentElement === document.body) {
                    document.body.removeChild(overlay);
                }


                iframeWrapper = _getIframe(_acceptUIWinName);
                if (iframeWrapper.parentElement === document.body) {
                    document.body.removeChild(iframeWrapper);
                }

                if (_resizeEventHandler) {
                    _removeEvent(window, 'resize', _resizeEventHandler);
                }
            }
          //  _hideIframeWin();

        },

    
        _receiveMessage = function (event) {
             if (typeof event.data === "object" && !!event.data.verifyOrigin && event.data.verifyOrigin === "AcceptMain") {
                 console.log("AcceptUI--"+event.data.type+" :"+JSON.stringify(event.data));
                 switch(event.data.type)
                 {
                     
                     case "ACK":
                        clearInterval(_intervalRef);
                        sendMessageToAcceptMain(_merchantOptions, "INIT");
                        break;
                     case "FIT_WINDOW" :
                        if (event.data.pktData && event.data.pktData.height) {
                            iframe = _getIframe(_acceptUIWinName);
                            iframe.style.height = event.data.pktData.height + 'px';
                            iframe.firstChild.style.height = event.data.pktData.height + 'px';
                            _lightboxHeight  = event.data.pktData.height;
                         
                        }
                        break;
                     case "RESPONSE":
                        _sendRespondBackToMerchant(event.data.pktData);
                        _hide();
                         _launch(); // TOHIDE
                        _sandInitMessage(); // TOHIDE
                        break;  

					case "CLOSE_IFRAME":
						_hide();
						_launch();
						_sandInitMessage();
					break;						
                 }
             }
           
        };
      _sendRespondBackToMerchant = function (response) {
          if (typeof _merchantCallback === "function") {
              _merchantCallback.call(null, response);
          }
          else {
              window[_merchantCallback](response);
          }
      }	


          if (document.readyState === "complete") {
          init();
      }
      else {
          document.onreadystatechange = function () {
              if (document.readyState == 'complete') {
                  init();
              }
          }

      }


}

)(window.AcceptUI = window.AcceptUI || {})



