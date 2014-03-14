// ==UserScript==
// @name       easyPolarion
// @namespace  https://polarion.server
// @version    0.1.2
// @description  Script to make the life with Polarion easier
// @require    http://code.jquery.com/jquery-latest.js
// @updateURL  https://raw.github.com/SushiTee/easyPolarion/master/easyPolarion.js
// @downloadURL  https://raw.github.com/SushiTee/easyPolarion/master/easyPolarion.js
// @copyright  2014, Sascha Weichel
// ==/UserScript==

var expanded = 0;
var autoClickActive = false;
var LastID = '';
var LastTestID = '';
var LastWorkItemID = '';
var testTimeArray = [];
var searchLineText = '';
var messageActive = false;

function addGlobalStyle(css) {
    var head = $('head');
    head.append('<style type="text/css">' + css + '</style>');
}

function removeGlobalStyle() {
    var head = $('head');
    head.children("style[type='text/css']:last-child").remove();
}

function waitForFnc(){
    var done = $('.polarion-BubblePanel-InputField');
    if(done.length <= 0){
        window.setTimeout(waitForFnc,200);
    }
    else{
        runScript();
    }
}

function expand() {
    if(expanded == 0) {
        addGlobalStyle('.JSTreeTableRow .fixed .content { white-space: normal !important; height: auto !important; } .JSTreeTableRow .fixed { height: auto !important; }');
        $('#ExpandDescription').html('Description (on)');
        expanded = 1;
    }
    else {
        removeGlobalStyle();
        $('#ExpandDescription').html('Description (off)');
        expanded = 0;
    }
}

function startMainLoop() {
    setInterval(mainLoop, 500);
}

function stopAutoClick() {
    var button = $('#AutoClick');
	$(button).attr('data-state', 'off');
    $(button).html('AutoClick (off)');
    autoClickActive = false;
}

function startAutoClick() {
    var button = $('#AutoClick');
    $(button).attr('data-state', 'on');
    $(button).html('AutoClick (on)');
    autoClickActive = true;
}

function updateSearchLineText() {
    searchLineText = $('.polarion-BubblePanel-InputField').val();
    var index = searchLineText.indexOf('TEST_RECORDS')+15;
    if(index == -1)
        return;
    
    searchLineText = searchLineText.substring(index);
    index = searchLineText.indexOf('/')+1;
    searchLineText = searchLineText.substring(index);
    index = searchLineText.indexOf('"');
    searchLineText = searchLineText.substring(0, index);
}

function setTextArea() {
    var areaText = $('#TestCaseMessage').val();
    if(!areaText.length) {
    	return;
    }
    var textAreaElement = $('.polarion-WatermarkTextArea');
    if(!textAreaElement.length) {
        return;
    }
    $(textAreaElement).attr('class', 'polarion-WatermarkTextArea');

    $(textAreaElement).val(areaText);
}

function getNextItem(curItem) {
	var nextItem = $(curItem).next();
    while($(nextItem).length && $(nextItem).find('img[src^="/polarion/icons/default/enums/type_heading.png"]').length) {
        nextItem = $(nextItem).next();
    }
    
    if(nextItem.length) {
    	return nextItem;
    }

    var nextParent = $(curItem).parent().next();
    if(!nextParent.length) {
        return nextItem;
    }
    
    var firstItem = $(nextParent).children('.JSTreeTableRow:first-child');
    if(!firstItem.length) {
    	return nextItem;
    }
    
    if($(firstItem).find('img[src^="/polarion/icons/default/enums/type_heading.png"]').length) {
        return getNextItem(firstItem);
    }

    return firstItem;
}

$(document).ready(function() {
	waitForFnc();

	$(document).on("click", "#ExpandDescription", function() {
		expand();
    });
    
    $(document).on("click", "#AutoClick", function() {
        var button = $('#AutoClick');
        if($(button).attr('data-state') == 'off') {
        	startAutoClick();
        }
        else {
            stopAutoClick();
        }
    });
    
    $(document).on("click", "#ExtraTestMenuButton", function() {
    	$('#ExtraTestMenu').toggle();
    });
    
    $(document).on('click', '.polarion-ExecuteTest-buttons', function() {
		var buttonText = $(this).text(),
            selectedItem = $('.JSTreeTableRow.selected.fixed');
        if(selectedItem.length <= 0) {
            selectedItem = $('.JSTreeTableRow.over.fixed');
        }

        if(buttonText == 'Passed') {
            $(selectedItem).attr('data-state', 'passed');
        }
        else if(buttonText.slice(0, 6) == 'Failed') {
            $(selectedItem).attr('data-state', 'failed');
        }
        else if(buttonText == 'Not Relevant') {
            $(selectedItem).attr('data-state', 'notRelevant');
        }
        else if(buttonText == 'Not Tested') {
            $(selectedItem).attr('data-state', 'notTested');
        }
        
        // average test time
        testTimeArray.push(new Date());
        if(testTimeArray.length > 11) {
            testTimeArray.splice(0, 1);
        }
        
        if(testTimeArray.length >= 2) {
            var diff = 0;
            for(var i = 0; i < testTimeArray.length-1; i++) {
                diff += testTimeArray[i+1] - testTimeArray[i];
            }
            
            var avTime = (diff/(testTimeArray.length-1))/1000;
            $('#testAvTime').html('Av. time: ' + avTime.toFixed(2) + 's');
        }
    });
    
    $(document).on("click", ".GGAJDYPMKB-com-polarion-portal-js-viewers-querypanel-SearchQueryButton-CSSSearch-Css", function() {
        updateSearchLineText();
    });
    
    $(document).on("click", ".GGAJDYPASB-com-polarion-reina-web-js-widgets-JSPopupButton-CSS-IconCellStyle.GGAJDYPBSB-com-polarion-reina-web-js-widgets-JSPopupButton-CSS-IconCellStyleWithoutText", function() {
        updateSearchLineText();
    });

    $(document).on("click", "#TestrunMessageClose", function() {
        messageActive = false;
        $('#TestrunMessageBackground').remove();
        $('#TestrunMessageBox').remove();
    });
    
    $(document).on("click", "#ItemMarkMenuButton", function() {
        var container = $('#ItemMarkMenu');
        if($(container).attr('data-menu') == 'off') {
			$(container).attr('data-menu', 'on');
            $('#ItemMarkPopup').css('display', 'inline-block');
        }
        else {
			$(container).attr('data-menu', 'off');
            $('#ItemMarkPopup').css('display', 'none');
        }
    });

    $(document).on("click", ".ItemMarkEl", function() {
        // close menu after click
        $('#ItemMarkPopup').css('display', 'none');
        $('#ItemMarkMenu').attr('data-menu', 'off');
        
        var selectedItem = $('.JSTreeTableRow.selected.fixed');
        if(selectedItem.length <= 0) {
            return;
        }
        
        if($(this).attr('data-id') == '0') {
            $(selectedItem).css('background-color', '');
        }
        else {
        	$(selectedItem).css('background-color', $(this).css('background-color'));
        }
    });
    
    $(document).on("click", "#testAvTime", function() {
        testTimeArray = [];
         $('#testAvTime').html('Av. time: -');
    });
});

function mainLoop() {
    TestRunCheck();
    autoClick();
}

function runScript() {
    // search line text
    updateSearchLineText();
    startMainLoop();

    // css stuff
    var menuImage = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATbSURBVEhLnVZp'
					+ 'SGVlGLaIaWomyJiiEJKiX0VENUQwTM2PgqE0Cfd9H1fcNfd96bqTy83UKS2vSwajMiriknKVUUljwhm9EKLmAuJ2cct77/l6nsNcu26MJXycc+75vud53vd93vdoZnaOv'
					+ '7i4uLCgoKDf3dzcHrq4uDz08fHxOsexk1va29ufLS4ufi8vL8/c9G10dPS34eHhwsvLS3h7e4vq6ur7W1tb7sY9eH6hrKzsbaVSaXEmcVpa2huRkZHRYWFhP8XGxqYWFR'
					+ 'XdzMrKugFwb39/fzWBHRwcBCIQVVVVoq2tbRxXW4VCcR3kUaGhoT9ERER8zWecfeYIUUtLy4WoqKhwAGk9PT0F0rGblJT0B8CHcb+C1EgEt7e3l0lIBrD9hISEaYgZ8PX'
					+ '1nXd3dxe47hYWFv7S399/TQjx1CFJQ0PDleDgYAVTQAIu3uOQngednZ2Fo6OjfDXeMxLu8fDw0Lm6ugonJycKE+Xl5dqJiQkFCF4/JKivr7+UmJjoFRISMgtwiZu5qNbO'
					+ 'zo7KBCISubm5IjMzUyCNMpGtra28j4vPSLMYHByUNjY2hiRJsjmSptra2ncyMjJaoHifmwkOdSI5OdnQ3Nws1Gq1fnx8fA3hzzc1Na3k5ORISJNcExIxbRUVFWJ9fX3RY'
					+ 'DB8D4JrRwjgnrdiYmIaEe4O00Hw7OxsaWxsbA+OWUTIv+JgFVbm3t6eYmhoqK2goGAOwAaKYVpRXGlhYeEBwL884SYUyz4wMHAOigwsJlJmAMjfWq32L4B+B4JPcPAVXK'
					+ '/g+tLS0pIlaucHUfMwhxxxfHy86Ovrm1tZWfnikABhxsNit6FEzYIai4e6iM3NTYZ7G4DXAfzkcVUdHR0WyLsKwrQkQAOK1NTUXfzWC1cq0aABZiighkWjI7iJ6WFTdXd'
					+ '3G/R6vRrgnwP8wmkNhBRdSk9PDwDGNJ3E2lEgI0JPCQi/Z4Yf58hMYBLQEWAWPT09O1DfAILXzurOgYGBi/duviqMiwRML50XEBAgYH0NI7iPGzkCkpCA7BgbmyBQMt9n'
					+ 'EaBBLx8nIAkNkpKSQltrzABug7YfUKlUAn0gE9BysO0+CqkCwYtnESDXz5sSsIcAqoe4g5mZGTE1NfVAPgsQq+Hh4Xa0/iIUyLZj00DhbxqN5uPTCKgeznM1JYCLpJGRk'
					+ 'R2dTjeN6O8CN+7wbE1NzVU44A4bjany8/NjLbbwe3Vra+tHGAEvV1ZWmpsCPu7+iDCofxOAKgy2HTqBqaJtYcEtvBvDiFDCMV89DtT0van652DVWyj4nwDVEZxO4AKhbD'
					+ 'u4YhPvZ/8XATrSHEqLOdSonk54BCpHYewPvuOiFY17jhWZ82hvcnIyF/m3PIygs7PzaXR0IMbtEp2EDw2/WhKWHvPIQE8T0Dg5aWnUi+8lUwJas6urS1pbW+sHwb/jAp3'
					+ '6BLrSsrS0NBGHZkdHRwU2La2urk5AzXh+fv4ai86pSfW0IvbscI8pQW9vr255eVmLCfAzMG+ccB+8awFA/+3t7SbYrBwqPsP6FJP2LseJlZWVsLa2Fo2NjfqDg4MZ7PnG'
					+ 'lADfgR8fzS47DsVT+4dzB6AfYL1r3ICJaYO09ZaUlGzX1dUJTEsBIKbhQ+MenLuI56u4vo91+T//10FSfkgQ/igbCSv7PED/AExELp7pn1dSAAAAAElFTkSuQmCC';
    var head = $('head');
    var css = '#ExtraTestMenuButton {background-size:18px;width:18px;height:18px;margin:7px;opacity:0.5;} #ExtraTestMenuButton:hover {opacity:1.0;} ';
    css += '#ExtraTestMenuButton {background-image: url(data:image/png;base64,' + menuImage + ')} ';
    css += '#ExtraTestMenu {display: none; position: absolute; top: 30px; left: 10px; border: 1px solid black; background-color: #D8D8D8; z-index: 5;} ';
    css += '#ExtraTestMenuButton:hover {cursor: pointer;} ';
    css += '#ItemMarkPopup {display: none; position: absolute; width: 100px; top: 40px; left: 10px; border: 1px solid black; background-color: #F7F7F7; z-index: 5;} ';
    css += '.ItemMarkEl {display: inline-block; height: 20px; width: 90px; margin: 2px;} ';
    css += '.ItemMarkEl:hover {cursor: pointer;} ';
    css += '.ItemMarkEl[data-id="1"] {background-color: #B3EBA2;} ';
    css += '.ItemMarkEl[data-id="2"] {background-color: #C94F4F;} ';
    css += '.ItemMarkEl[data-id="3"] {background-color: #AB61DD;} ';
    css += '.ItemMarkEl[data-id="4"] {background-color: #D7DD46;} ';
    css += '.JSTreeTableRow[data-state="passed"] {background-color: #B3EBA2;} .JSTreeTableRow[data-state="passed"]:hover {background-color: #A6D896;} ';
    css += '.JSTreeTableRow[data-state="failed"] {background-color: #C94F4F;} .JSTreeTableRow[data-state="failed"]:hover {background-color: #A73838;} ';
    css += '.JSTreeTableRow[data-state="notRelevant"] {background-color: #AB61DD;} .JSTreeTableRow[data-state="notRelevant"]:hover {background-color: #894BB3;} ';
    css += '.JSTreeTableRow[data-state="notTested"] {background-color: #D7DD46;} .JSTreeTableRow[data-state="notTested"]:hover {background-color: #C3C947;} ';
    css += '#testAvTime {margin-left: 5px;} ';
    css += '#testAvTime:hover {cursor: pointer;} ';
    css += '#ItemMarkMenu {position:relative;}';
    head.append('<style type="text/css">' + css + '</style>');
    
    var tbody = $('.polarion-NavigationPanelSettingsShortcuts').children('tbody');
    if(tbody.length == 0) {
        tbody = $('.polarion-NavigationPanelSettingsShortcuts');
    }
    tbody.children('tr').append('<td><div id="ExtraTestMenuButton"></div></td><td><div id="ExtraTestMenu"></div></td>');
    
    var menuHtml = '<table>'
                        + '<tr><td><button id="ExpandDescription">Description (off)</button></td></tr>'
                        + '<tr><td><button id="AutoClick" data-state="off">AutoClick (off)</button></td></tr>'
                        + '<tr><td><input id="AutoClickButton" type="text" placeholder="Buttontext"/></td></tr>'
                        + '<tr><td><textarea id="TestCaseMessage" placeholder="Test case comment"></textarea></td></tr>'
                        + '<tr><td>'
                            + '<form>'
                                + '<input type="radio" name="testSetting" value="pause" checked="True">Pause at headline<br>'
                                + '<input type="radio" name="testSetting" value="skip">Skip headlines<br>'
                                + '<input type="radio" name="testSetting" value="stop">Stop at headline'
                            + '</form>'
                        + '</td></tr>'
                        + '<tr><td><div id="testAvTime">Av. time: -</div></td></tr>'
                    + '</table>';
    
    var menu = $('#ExtraTestMenu');
    $(menu).html(menuHtml);
    
    var searchField = $('.polarion-BubblePanel-InputField').closest('.GGAJDYPHKB-com-polarion-portal-js-viewers-querypanel-AbstractQueryPanel-CSS-CellFree').parent().closest('td');
    if(!searchField.length) {
        return;
    }
    
    $(searchField).next().next().after('<td id="ItemMarkMenu" data-menu="off" class="GGAJDYPGKB-com-polarion-portal-js-viewers-querypanel-AbstractQueryPanel-CSS-Cell">'
                                           + '<div id="ItemMarkPopup">'
                                               + '<table>'
                                                    + '<tr><td><div class="ItemMarkEl" data-id="0">Default</div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-id="1"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-id="2"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-id="3"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-id="4"></div></td></tr>'
                                                + '</table>'
                                            + '</div>'
                                            + '<table id="ItemMarkMenuButton" cellspacing="0" cellpadding="0" class="GGAJDYPB1B-com-polarion-reina-web-js-widgets-toolbar-ToolbarPopupButton-CSS2-Button">'
                                                + '<tr>'
                                                    + '<td class="GGAJDYPASB-com-polarion-reina-web-js-widgets-JSPopupButton-CSS-IconCellStyle GGAJDYPBSB-com-polarion-reina-web-js-widgets-JSPopupButton-CSS-IconCellStyleWithoutText" valign="middle" title="Show Sidebar">'
                                                        + '<img class="GGAJDYPP-B-com-polarion-reina-web-js-widgets-toolbar-ToolbarButton-CSS2-Icon" src="data:image/png;base64,' + menuImage + '">'
                                                    + '</td>'
                                                    + '<td class="GGAJDYPG1B-com-polarion-reina-web-js-widgets-toolbar-ToolbarPopupButton-CSS2-IconTD" valign="middle">'
                                                       + '<img class="GGAJDYPP0B-com-polarion-reina-web-js-widgets-toolbar-ToolbarPopupButton-CSS2-Arrow" src="/polarion/ria/images/button_arrow.gif">'
                                                    + '</td>'
                                                + '</tr>'
                                            + '</table>'
                                       + '</td>');
}

function autoClick() {
    if(!autoClickActive || messageActive) {
        return;
    }

    var AutoClickButton = $('#AutoClickButton').val();
    if(!AutoClickButton) {
        AutoClickButton = 'Passed';
    }

    // detect headlines
    var isHeadline = false;
    var selectedItem = $('.JSTreeTableRow.selected.fixed');
    if(selectedItem.length <= 0) {
        selectedItem = $('.JSTreeTableRow.over.fixed');
    }
    if($(selectedItem).find('img[src^="/polarion/icons/default/enums/type_heading.png"]').length) {
        isHeadline = true;
    }
    
    if(isHeadline) {
        var settingsVal = $("input[name='testSetting']:checked").val();
        if(settingsVal == 'stop') {
            stopAutoClick();
            return;
        }
        if(settingsVal == 'skip') {
            var nextItem = getNextItem(selectedItem);

            if($(nextItem).length) {
                $(nextItem).click();
                return;
            }
        }
    }

    // only run once per item
    var button = $('.polarion-ExecuteTest-buttons[title="' + AutoClickButton + '"]');
    if(!button.length) {
        return;
    }

    var ID = $(button).closest('.GGAJDYPCNB-com-polarion-reina-web-js-widgets-HTMLContainer-CSS-Css').attr('id');

    if(LastID == ID) {
        return;
    }

    LastID = ID;

    // check if we already clicked
    var allButtons = $('.polarion-ExecuteTest-buttons');
    var lastColor = 'none';
    var alreadyClicked = false;
    $(allButtons).each(function(index) {
        var curColor = $(this).css('color');
        if(lastColor != 'none' && lastColor != curColor) {
            alreadyClicked = true;
            return;
        }
        lastColor = curColor;
    });
	
    if(alreadyClicked) {
        return;
    }
    
    // set message and click the button
    setTextArea();
    $(button).trigger('click');
}

function TestRunCheck() {
    var testRunElement = $(".polarion-JSPreviewPanelTitle:contains('Execute Test')");
    if(!testRunElement.length) {
        return;
    }

    var ID = $(".polarion-JSPreviewPanelTitle:contains('Execute Test')").attr('id');
    
    if(LastTestID == ID) {
        return;
    }
    
	var comboText = $('.polarion-ExecuteTest-combo').text();
    var index = comboText.indexOf('(')-1;
    if(index == -1 || !comboText.length || !searchLineText.length) {
        return;
    }

    comboText = comboText.substring(0, index);
    
    if(comboText != searchLineText) {
        showTestrunMessage();
        var button = $('#AutoClick');
        if($(button).attr('data-state') == 'on') {
            stopAutoClick();
        }
    }
    
    LastTestID = ID;
}

function showTestrunMessage() {
    messageActive = true;

    var width = $(window).width();
    var height = $(window).height();
    var backGroundHTML = '<div id="TestrunMessageBackground" class="polarion-EasyDialog-glass" style="position: absolute; left: 0px; top: 0px; z-index: 2000; visibility: visible; display: block; width: ' + width + 'px; height: ' + height + 'px;"></div>';
    $('body').append(backGroundHTML);

    var messageBoxHTML = '<div id="TestrunMessageBox" class="polarion-EasyDialog" style="left: 0; top: 184px; z-index: 2001; visibility: visible; position: absolute; overflow: visible;">'
                            + '<div class="">'
                               + '<table cellspacing="0" cellpadding="0" class="">'
                                    + '<tr class="dialogTop">'
                                        + '<td class="dialogTopLeft">'
                                            + '<div class="dialogTopLeftInner"></div>'
                                        + '</td>'
                                        + '<td class="dialogTopCenter">'
                                            + '<div class="dialogTopCenterInner"><div class="polarion-EasyDialog-caption"></div></div>'
                                        + '</td>'
                                        + '<td class="dialogTopRight">'
                                            + '<div class="dialogTopRightInner"></div>'
                                        + '</td>'
                                    + '</tr>'
                                    + '<tr class="dialogMiddle">'
                                        + '<td class="dialogMiddleCenter">'
                                            + '<div class="dialogMiddleCenterInner dialogContent">'
                                                + '<table cellspacing="0" cellpadding="0">'
                                                    + '<tr>'
                                                        + '<td align="left" style="vertical-align: top;">'
                                                            + '<table cellspacing="0" cellpadding="0" class="polarion-EasyDialog-top">'
                                                                + '<tr>'
                                                                    + '<td align="left" style="vertical-align: top;">'
                                                                        + '<div class="polarion-EasyDialog-title">Test runs differ.</div>'
                                                                    + '</td>'
                                                                + '</tr>'
                                                            + '</table>'
                                                        + '</td>'
                                                    + '</tr>'
                                                    + '<tr>'
                                                        + '<td align="left" style="vertical-align: top;">'
                                                            + '<table cellspacing="0" cellpadding="0" class="polarion-EasyDialog-bottom">'
                                                                + '<tr>'
                                                                    + '<td align="left" style="vertical-align: top;">'
                                                                        + '<table><tr>'
                                                                            + '<td align="left" style="vertical-align: top;">'
                                                                                +'<div class="polarion-EasyDialog-content">'
                                                                                    + '<span class="gwt-InlineLabel">Please check if you are in the correct test run. </span>'
                                                                                    + '<table cellspacing="0" cellpadding="0" class="polarion-EasyDialog-confirm">'
                                                                                        + '<tr>'
                                                                                            + '<td align="left" style="vertical-align: top;">'
                                                                                                + '<table cellspacing="0" cellpadding="0" class="polarion-EasyDialog-buttons">'
                                                                                                    + '<tr>'
                                                                                                        + '<td align="left" style="vertical-align: top;"><button type="button" id="TestrunMessageClose" class="polarion-EasyDialog-buttonGreen" title="Ok" style="overflow: visible;">Ok</button></td>'
                                                                                                    + '</tr>'
                                                                                                + '</table>'
                                                                                            + '</td>'
                                                                                        + '</tr>'
                                                                                    + '</table>'
                                                                                + '</div>'
                                                                            + '</td>'
                                                                        + '</tr></table>'
                                                                    + '</td>'
                                                                + '</tr>'
                                                            + '</table>'
                                                        + '</td>'
                                                    + '</tr>'
                                                + '</table>'
                                            + '</div>'
                                        + '</td>'
                                    + '</tr>'
                                + '</table>'
                            + '</div>'
                        + '</div>';
    $('body').append(messageBoxHTML);
    
    var messageBoxWidth = $('#TestrunMessageBox').width();
    
    $('#TestrunMessageBox').css('left', (width/2-messageBoxWidth/2) + 'px');
}
