// ==UserScript==
// @name       easyPolarion
// @namespace  https://polarion.server
// @version    0.1.18
// @description  Script to make the life with Polarion easier
// @include    /^https?://polarion\.server.*/polarion/.*$/
// @grant      none
// @noframes
// @require    http://code.jquery.com/jquery-latest.js
// @updateURL  https://raw.github.com/SushiTee/easyPolarion/master/easyPolarion.js
// @downloadURL  https://raw.github.com/SushiTee/easyPolarion/master/easyPolarion.js
// @copyright  2014, Sascha Weichel
// ==/UserScript==

var expanded = 0;
var autoClickActive = false;
var autoTestrunActive = true;
var LastID = '';
var LastTestID = '';
var LastWorkItemID = '';
var testTimeArray = [];
var searchLineText = '';
var searchLineTextRunCount = 0;
var testCounter = {passed: 0, failed: 0, notRelevant: 0, notTested: 0};
var messageActive = false;
var viewObjects = [];
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
var autoClickImage = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK'
                       	+ 'T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU'
                       	+ 'kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX'
                       	+ 'Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB'
                       	+ 'eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt'
                      	+ 'AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3'
                        + 'AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX'
                        + 'Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+'
                        + '5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk'
                        + '5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd'
                        + '0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA'
                        + '4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA'
                        + 'BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph'
                        + 'CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5'
                        + 'h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+'
                        + 'Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM'
                        + 'WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ'
                        + 'AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io'
                        + 'UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp'
                        + 'r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ'
                        + 'D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb'
                        + 'U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY'
                        + '/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir'
                        + 'SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u'
                        + 'p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh'
                        + 'lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1'
                        + 'mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO'
                        + 'k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry'
                        + 'FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I'
                        + 'veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B'
                        + 'Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/'
                        + '0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p'
                        + 'DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q'
                        + 'PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs'
                        + 'OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5'
                        + 'hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ'
                        + 'rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9'
                        + 'rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d'
                        + 'T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX'
                        + 'Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7'
                        + 'vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S'
                        + 'PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa'
                        + 'RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO'
                        + '32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21'
                        + 'e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV'
                        + 'P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i'
                        + '/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8'
                        + 'IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq'
                        + 'YAAAOpgAABdvkl/FRgAAAmtJREFUeNrsls1t20AQhb8h16YomKAM5BDk5AIChMfcTHfgVOD44LOd'
                        + 'CqJU4JRgVyCnAkkVmB1EqWDJg2VCJLU5eCkwin6TGDrEDxiIeKD2zczbnaUYY9gFHHYE2VXF/5/w'
                        + 'zjx+FmGt9UettdFa9/+JsNY61lp/11r35vhTrXW3QZ0BKKViYKG4WiFyDUTA+eHh4cjS18CRUuo1'
                        + '0AM+aK1P7XONWQIisl2r0zSNReRKROKDg4MecGQXikSEvb29FtCx3JmI4LouwOdacJXoRq0WkagW'
                        + 'nsPQ/nYAHMcBGG1qm7IV3tu23gHfgHQL62OgrnjU5NYKW1GAUxszVFWFUoo0TY/WdAYg+WVxpVa3'
                        + 'WkS+uK4786YZeZ6TZVlfRPo1N51Oqaqqk2VZZ87PbIHHw6UVh2HYtdVdFEXxpixLqqqaf3dWcVEU'
                        + 'FEVxCVw2O/P4+Ph+MpnEfzoyo/F4/LUoimOA/f19ptPpLLaaTo6D4zhJWZa3QBKG4WDlrM6yrFsf'
                        + 'jTAMAW7KsoweHh6i2julFEVRLOrMOgzCMDxRKzZKE+fj8TgWkX4t7HneQER+5Hl+BuD7PiJCWZZM'
                        + 'JpN1p6D/N7N6mOf5TTNZpdQ58Knm2u02QRDQbrfxPA/XdfF9HyBett/fbX2/PnVp1KzW7u4TpVSi'
                        + 'lIo9z4uAY+B2mXBzGm1ixTqkdjjdrbwk6oWbY7ApZqdUuiiBTZPaxONl8zcBEsdxbn3fnyXTTM5y'
                        + 'bHMtDl3XfdtqtV4tOZsABEGQAlc2uQRIgiAAOLH38MDG7zDGLIuuMaZnjIkaXGyecG+M6az479p4'
                        + '+bx9EX42/BwANxJCTOz37BAAAAAASUVORK5CYII=';
var descriptionImage = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK'
                        + 'T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU'
                        + 'kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX'
                        + 'Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB'
                        + 'eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt'
                        + 'AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3'
                        + 'AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX'
                        + 'Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+'
                        + '5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk'
                        + '5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd'
                        + '0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA'
                        + '4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA'
                        + 'BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph'
                        + 'CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5'
                        + 'h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+'
                        + 'Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM'
                        + 'WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ'
                        + 'AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io'
                        + 'UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp'
                        + 'r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ'
                        + 'D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb'
                        + 'U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY'
                        + '/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir'
                        + 'SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u'
                        + 'p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh'
                        + 'lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1'
                        + 'mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO'
                        + 'k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry'
                        + 'FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I'
                        + 'veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B'
                        + 'Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/'
                        + '0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p'
                        + 'DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q'
                        + 'PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs'
                        + 'OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5'
                        + 'hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ'
                        + 'rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9'
                        + 'rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d'
                        + 'T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX'
                        + 'Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7'
                        + 'vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S'
                        + 'PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa'
                        + 'RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO'
                        + '32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21'
                        + 'e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV'
                        + 'P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i'
                        + '/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8'
                        + 'IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq'
                        + 'YAAAOpgAABdvkl/FRgAAArRJREFUeNrkVrty2kAUPSstQmAEKzUae2AYjylcZFLYJZm0yT9k0qXN'
                        + 'F+QrUmfyF6lpmdjjwk4fxgXYhbHAi6T1AtpU0sRCYBlwXORU2tXVnnvP3oeIUgovAQ0vhP+PmKY3'
                        + 'wjBc+9I9z4Nt2/A8j6Tf7e3tPX/Etm2rF5P6MXK6SrYnkCwlz5I9kziua8ZYbuK/e0G6LzDG1Gg0'
                        + 'IrkjXhej0SjTNwDk2YiXqZTlDH2i508iXCu51jlsI+J/NTRImsj3/VzM4/EYtVoNeW1PTk5IFEXQ'
                        + 'NA0A3tJVxnkOXIW0Y0opEEJqrusOad6PVsH3fQyHQ9Tr9TiiBcznc5RKJZRKpXdHR0djbVu1e3Fx'
                        + 'gclkstSmWCzCsqzP7Xb7J6X090bJ1ev1IISAlBKUUlxdXaHf7y+cIYRAo9H41Gw2fxiGwQCcL5X6'
                        + '7u5uYa9arT5Y9/t9SClhGAZ0XUcYhri9vcV0OgUhBISQRGbLsr4xxl4DOF9Zx2mSLLRaLVQqFUyn'
                        + 'U3S7Xezu7uLw8BCFQgG6riMIAoRhiNPT0/juzY3HIuccOzs7UEqBUgpd11EoFCClhO/7UEqhWCzC'
                        + 'NE1QSuPo1UbEnPMH65ubmyTKWN7BYABKKQzDQBRF+TtX+nDLsgAgM3M1TUvKSCkFzjkYY4mtpmmJ'
                        + 'Q4/26pgojUqlsrAXBAE0TcP9/T2q1Spc102SSwgB0zRhmiaCIOBCCDiOs72xSCkF5xzz+TwhVUoh'
                        + 'iiIwxqCUwtnZ2cdms/ndcZzeVudxXMOEkET6+NnzPEgpv+zv738A8GphSAwGgwfZlwdSyiSL05jN'
                        + 'Zri8vARjTNm2PXEcR5TL5RZd8v9L8hB2Op2kQbTbbbNcLhtpm+vr62Pf9zuu65J6vf4ewC8Ak61J'
                        + 'PZvNBACR0Va7BwcHXxuNxhsAQwAcAP4MADNoMpotm3/6AAAAAElFTkSuQmCC';
var horizontalImage = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAZCAIAAACpVwlNAAAACXBIWXMAABcRAAAXEQHKJvM/AAAA'
                    + 'yElEQVR4nO3VMQqEMBAF0MyioE4jopV9zpDTiQfwVnoBK3trC5sRJZjZImFB2HJ2YRd/9dM8fjEQ'
                    + 'WNcVEZV0nHNRHMfW2mmaBF2tNSIqIhrHUdBVSvV975yL/AMRm6YRcdu2Dc2vrqqKhVIUhV/9EFn6'
                    + 'Njf9F3S4a2Y+jkNEZOYLvSxLkiQi9CuBLstynmcRsa7rCw0AaZqK0ADgy29eyE1/jw7Ht21b13Ui'
                    + '4r7voX3ubwQiOs9zGAZB2hiT5zkQUZZlgq4PMz8B5G2cuczdlbsAAAAASUVORK5CYII=';
var verticalImage = 'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAZCAIAAACpVwlNAAAACXBIWXMAABcRAAAXEQHKJvM/AAAA'
                    + 'sUlEQVR4nO2VMQqFMAyGk4dOBaEBx27eoODxxAN4gIL3EI9gL+AdXEqn0kGog+Vtrw6vbv2mBP58'
                    + 'JFPwOA4igheo6ro+z3Pf94zSruuapgFjTF4vAKzrGkKo7oYxNgxDekBrjYh936dj4zjG6t66bdvw'
                    + 'hFJqnufHGBHdW3/+Pf43RV3URV3URZ2R+GWcc9M0paPbtiGitTYd897H6t3fKIRYliWjWkoJAGiM'
                    + '4Zxn9H65AP82hyFzy2/WAAAAAElFTkSuQmCC';
var editImage = "<svg xml:space='preserve' enable-background='new 0 0 512 512' viewBox='0 0 512 512' y='0px' x='0px' xmlns:xlink='http://www.w3.org/1999/xlink' "
				+ "xmlns='http://www.w3.org/2000/svg' version='1.1'><path fill='white' id='pencil-10-icon' d='M172.782,438.836L172.782,438.836L50.417,461.42l24.686-120.264l0.001-0.001L172.782,438.836z "
				+ "M364.735,51.523l-43.829,43.829l97.682,97.68l43.829-43.829L364.735,51.523z M96.996,319.263l97.681,97.679l202.017-202.015 l-97.68-97.682L96.996,319.263z'/></svg>";
var addImage = "<svg xml:space='preserve' enable-background='new 0 0 512 512' viewBox='0 0 512 512' y='0px' x='0px' width='auto' height='auto' xmlns:xlink='http://www.w3.org/1999/xlink' "
				+ "xmlns='http://www.w3.org/2000/svg' version='1.1'><polygon fill='green' id='plus-icon' points='462,198.615 313.385,198.615 313.385,50 198.615,50 198.615,198.615 50,198.615 "
				+ "50,313.385 198.615,313.385 198.615,462 313.385,462 313.385,313.385 462,313.385'/></svg>";
var deleteImage = "<svg xml:space='preserve' enable-background='new 0 0 512 512' viewBox='0 0 512 512' y='0px' x='0px' xmlns:xlink='http://www.w3.org/1999/xlink' "
				+ "xmlns='http://www.w3.org/2000/svg' version='1.1'><polygon fill='red' id='x-mark-icon' points='438.393,374.595 319.757,255.977 438.378,137.348 374.595,73.607 "
				+ "255.995,192.225 137.375,73.622 73.607,137.352 192.246,255.983 73.622,374.625 137.352,438.393 256.002,319.734 374.652,438.378'/></svg>"

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function addGlobalStyle(css) {
    var head = $('head');
    head.append('<style type="text/css">' + css + '</style>');
}

function removeGlobalStyle() {
    var head = $('head');
    head.children("style[type='text/css']:last-child").remove();
}

function waitForFnc(){
    var done = $('.polarion-NavigationPanelSettingsShortcuts');
    if(!done || done.length <= 0){
        window.setTimeout(waitForFnc,200);
    }
    else {
        runScript();
    }
}

function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
    return el;
}

function drawArcs(paper, pieData){
    var total = pieData.reduce(function (accu, that) { return that + accu; }, 0);
    var sectorAngleArr = pieData.map(function (v) { return 360 * v / total; });
    var colorArray = ['#B3EBA2', '#C94F4F', '#AB61DD', '#D7DD46'];
    var arc;

    var startAngle = 0;
    var endAngle = 0;
    for (var i=0; i<sectorAngleArr.length; i++){
        if(sectorAngleArr[i] == 0) {
            continue;
        }
        else if(sectorAngleArr[i] == 360) {
            arc = makeSVG("circle", {class: "svgPie " + i, cx: "50%", cy: "50%", r: "50%", stroke: "#464852", fill: colorArray[i]});
            paper.appendChild(arc);
            return;
        }

        startAngle = endAngle;
        endAngle = startAngle + sectorAngleArr[i];

        var x1,x2,y1,y2 ;

        x1 = parseInt(Math.round(200 + 195*Math.cos(Math.PI*startAngle/180)), 10);
        y1 = parseInt(Math.round(200 + 195*Math.sin(Math.PI*startAngle/180)), 10);

        x2 = parseInt(Math.round(200 + 195*Math.cos(Math.PI*endAngle/180)), 10);
        y2 = parseInt(Math.round(200 + 195*Math.sin(Math.PI*endAngle/180)), 10);

        var d = "M200,200  L" + x1 + "," + y1 + "  A195,195 0 " + 
                ((endAngle-startAngle > 180) ? 1 : 0) + ",1 " + x2 + "," + y2 + " z";

        var c = parseInt(i / sectorAngleArr.length * 360, 10);
        arc = makeSVG("path", {class: "svgPie " + i, d: d, stroke: "#464852", fill: colorArray[i]});
        paper.appendChild(arc);
        //arc.onclick = clickHandler;
    }
}

function drawPieChart() {     
    $('#s path').remove();
    $('#s circle').remove();
    
    var vals = [parseInt(testCounter.passed ,10), parseInt(testCounter.failed,10), parseInt(testCounter.notRelevant,10), parseInt(testCounter.notTested,10)];
    var svgdoc = document.getElementById("s");
    drawArcs(svgdoc, vals);
}

function changeView(panelView, savedView) {
    var topBarArrow = $('.polarion-BubblePanel-InputField').closest('.GGAJDYPHKB-com-polarion-portal-js-viewers-querypanel-AbstractQueryPanel-CSS-CellFree').parent().closest('td').parent('tr').children('td:last').find('td:last');
    var headlineElement = $('#_ui_tree_table_header');
    var position;
    var panelViewText;
    if(panelView == 'Horizontal') {
        panelViewText = 'Tile Panes Horizontally';
    }
    else {
        panelViewText = 'Tile Panes Vertically';
    }

    $(topBarArrow).click();
    
    var runCount = 0;
    waitForButton();
    
    function waitForButton() {
        var buttonElement = $('.GGAJDYPB-B-com-polarion-reina-web-js-widgets-menu-ContextMenuItem-CSS-Content:contains("' + panelViewText + '")');
        
        if(!buttonElement || buttonElement.length <= 0) {
            if(runCount >= 10) {
                return;
            }
            
            runCount++;
            window.setTimeout(waitForButton,20);
        }
        else {
            $(buttonElement).click();
            
            var iFrameElement = $('.GGAJDYPGNB-com-polarion-reina-web-js-widgets-HTMLPopupContainer-CSS-WorkaroundFrameCss');
            if(iFrameElement.length) {
                $(topBarArrow).click();
            }
            
            position = $('#_ui_tree_table_header').offset();
            $(document.elementFromPoint(position.left+2, position.top+2)).trigger({type:'contextmenu'});
            
            runCount = 0;
            waitForHeadline();
        }
    }
    
    function waitForHeadline() {
        var menuElement = $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css');
        
        if(!menuElement || menuElement.length <= 0) {
            if(runCount >= 10) {
                return;
            }
            
            runCount++;
            window.setTimeout(waitForHeadline,20);
        }
        else {
            $(menuElement).css({'left': (position.left+2) + 'px', 'top': (position.top+2) + 'px'});
            $(menuElement).find('tr:first').children('td:nth-child(2)').trigger('mouseover');
            
            runCount = 0;
            waitForView();
        }
    }
    
    function waitForView() {
        var menuElement = $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css:last');
        
        if(!menuElement || menuElement.length <= 0) {
            if(runCount >= 10) {
                return;
            }
            
            runCount++;
            window.setTimeout(waitForHeadline,20);
        }
        else {
            $(menuElement).find('td:contains("' + savedView + '")').click();
            
            $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css').remove();
            $('.GGAJDYPGNB-com-polarion-reina-web-js-widgets-HTMLPopupContainer-CSS-WorkaroundFrameCss').remove();
        }
    }
}

function getViews(callback) {
    var tableHeader = $('#_ui_tree_table_header');
    if(!tableHeader.length) {
        callback([]);
    	return;
    }
    
    var position = $(tableHeader).offset();
    $(document.elementFromPoint(position.left+2, position.top+2)).trigger({type:'contextmenu'});
    
    var runCount = 0;
    waitForHeadline();

	function waitForHeadline() {
        var menuElement = $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css');
        
        if(!menuElement || menuElement.length <= 0) {
            if(runCount >= 10) {
                callback([]);
                return;
            }
            
            runCount++;
            window.setTimeout(waitForHeadline,20);
        }
        else {
            $(menuElement).css({'left': (position.left+2) + 'px', 'top': (position.top+2) + 'px'});
            $(menuElement).find('tr:first').children('td:nth-child(2)').trigger('mouseover');
            
            runCount = 0;
            waitForView();
        }
    }
    
    function waitForView() {
        var menuElement = $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css:last');
        
        if(!menuElement || menuElement.length <= 0) {
            if(runCount >= 10) {
                callback([]);
                return;
            }
            
            runCount++;
            window.setTimeout(waitForHeadline,20);
        }
        else {
            var retVal = [];
            $(menuElement).find('td.GGAJDYPB-B-com-polarion-reina-web-js-widgets-menu-ContextMenuItem-CSS-Content').not(':last').each(function(index) {
            	retVal.push($(this).text());
            });
            
            $('.GGAJDYPL-B-com-polarion-reina-web-js-widgets-menu-ContextSubMenu-CSS-Css').remove();
            $('.GGAJDYPGNB-com-polarion-reina-web-js-widgets-HTMLPopupContainer-CSS-WorkaroundFrameCss').remove();
            callback(retVal);
        }
    }
}

function drawViews() {
    var viewTableHTML = '';
    var viewDropDown = '';
    for(var i = 0; i < viewObjects.length; i++) {
        var viewObject = viewObjects[i];
        var image = verticalImage;
        if(viewObject.panes == 'Horizontal') {
        	image = horizontalImage;
        }
        viewTableHTML += '<tr class="noBlock" data-panes="' + viewObject.panes + '" data-name="' + viewObject.name + '">'
        					+ '<td>'
    							+ '<div class="action">'
    								+ '<div class="icon"><img src="data:image/png;base64,' + image + '" class="gwt-Image"></div>'
    								+ '<div class="gwt-Label">' + viewObject.name + '</div>'
    							+ '</div>'
    						+ '</td>'
    					+ '</tr>';
        if(i == 0) {
        	viewDropDown += '<div class="selectOption selected">' + viewObject.name + '</div>';
        }
        else {
        	viewDropDown += '<div class="selectOption">' + viewObject.name + '</div>';
        }
    }
    $('#viewTable').html(viewTableHTML);
    $('#activatedViewOptions').html(viewDropDown);
    if(viewDropDown.length > 0) {
    	$('#activatedViewOptions').parent('.styledSelect').find('.selectBoxText').html(viewObjects[0].name);
    }
}

function selectTestrun(callback) {
    $('.polarion-ExecuteTest-combo').find('div.label').click();
    
    var runCount = 0;
    waitForTestrunSelection();
    
    function waitForTestrunSelection() {
        var menuElement = $('.gwt-PopupPanel');
        if(!menuElement || menuElement.length <= 0) {
            if(runCount >= 10) {
                return;
            }
            
            runCount++;
            window.setTimeout(waitForTestrunSelection,20);
        }
        
        $(menuElement).find('td.gwt-MenuItem:contains("' + searchLineText + '")').click();
        callback();
    }
}

function expand() {
    if(expanded == 0) {
        addGlobalStyle('.JSTreeTableRow .fixed .content { white-space: normal !important; height: auto !important; } .JSTreeTableRow .fixed { height: auto !important; }');
        $('#ExpandDescription').find('.gwt-Label').html('Description (on)');
        expanded = 1;
    }
    else {
        removeGlobalStyle();
        $('#ExpandDescription').find('.gwt-Label').html('Description (off)');
        expanded = 0;
    }
}

function startMainLoop() {
    setInterval(mainLoop, 500);
}

function stopAutoClick() {
    var button = $('#AutoClick');
	$(button).attr('data-state', 'off');
    $(button).find('.gwt-Label').html('AutoClick (off)');
    autoClickActive = false;
}

function startAutoClick() {
    var button = $('#AutoClick');
    $(button).attr('data-state', 'on');
    $(button).find('.gwt-Label').html('AutoClick (on)');
    autoClickActive = true;
}

function deactivateAutoTestrun() {
    var button = $('#AutoTestrun');
	$(button).attr('data-state', 'off');
    $(button).find('.gwt-Label').html('AutoTestrun (off)');
    autoTestrunActive = false;
}

function activateAutoTestrun() {
    var button = $('#AutoTestrun');
    $(button).attr('data-state', 'on');
    $(button).find('.gwt-Label').html('AutoTestrun (on)');
    autoTestrunActive = true;
}

function updateSearchLineText() {
    searchLineText = $('.polarion-BubblePanel-InputField').val();

    if(!searchLineText) {
        if(searchLineTextRunCount < 10) {
    		searchLineTextRunCount++;
            window.setTimeout(updateSearchLineText,20);
        }
    }

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

function addMarkMenu() {
    if($('#ItemMarkMenu').length) {
        return;
    }

    var searchField = $('.polarion-BubblePanel-InputField');
    if(!searchField.length) {
        return;
    }

	// update search text    
    updateSearchLineText();
	
    searchField = $(searchField).closest('.GGAJDYPHKB-com-polarion-portal-js-viewers-querypanel-AbstractQueryPanel-CSS-CellFree').parent().closest('td');
    if(!searchField.length) {
        return;
    }

    $(searchField).next().next().after('<td id="ItemMarkMenu" data-menu="off">'
                                           + '<div style="position: relative;"><div id="ItemMarkPopup">'
                                               + '<table>'
                                                    + '<tr><td><div class="ItemMarkEl" data-state="none">Default</div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-state="passed"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-state="failed"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-state="notRelevant"></div></td></tr>'
                                                    + '<tr><td><div class="ItemMarkEl" data-state="notTested"></div></td></tr>'
                                                + '</table>'
                                            + '</div></div>'
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

function toggleMenu() {
    $('.polarion-NavigationPanel').toggle();

    $('#ExtraTestMenu').toggle();
    
    // menu splitter
    if($('#ExtraTestMenu').css('display') == 'none') {
        $('.polarion-PortalBaseSplitter').css('background-color', 'rgb(231, 231, 231)');
    }
    else {
        $('.polarion-PortalBaseSplitter').css('background-color', 'rgb(70, 72, 82)');
    }
}

$(document).ready(function() {
	waitForFnc();

	$(document).on("click", "#ExpandDescription", function() {
		expand();
    });
    
    $(document).on("click", "#AutoClick", function() {
        if($('#AutoClick').attr('data-state') == 'off') {
        	startAutoClick();
        }
        else {
            stopAutoClick();
        }
    });
    
    $(document).on("click", "#AutoTestrun", function() {
        if($('#AutoTestrun').attr('data-state') == 'off') {
        	activateAutoTestrun();
        }
        else {
            deactivateAutoTestrun();
        }
    });
    
    $(document).on("click", "#ExtraTestMenuButtonShow", function() {
        toggleMenu();
    });
    
    $(document).on("click", "#ExtraTestMenuButtonHide", function() {
        toggleMenu();
    });
    
    $(document).on("click", ".arrow", function() {
        var classAttr = $(this).attr('class');
        var headLineBox = $(this).parents('.testMenuHeadlineBox');
        
        if(classAttr == 'arrow right') {
            $(this).attr('class', 'arrow down');
            
            // store information in a cookie
            createCookie('extraMenu_' + $(headLineBox).find('.testMenuHeadlineText').text(), '1', 2); // 1 = open
        }
        else {
            $(this).attr('class', 'arrow right');

            // store information in a cookie
            createCookie('extraMenu_' + $(headLineBox).find('.testMenuHeadlineText').text(), '0', 2); // 0 = closed
        }
        
        $(headLineBox).next('.testMenuItem').slideToggle(150);
    });
    
    $(document).on('click', '.polarion-ExecuteTest-buttons', function() {
		var buttonText = $(this).text(),
            selectedItem = $('.JSTreeTableRow.selected.fixed');
        if(selectedItem.length <= 0) {
            selectedItem = $('.JSTreeTableRow.over.fixed');
        }

        if(buttonText == 'Passed') {
            $(selectedItem).attr('data-state', 'passed');
            
            testCounter.passed++;
            
            $('#testPassed td:nth-child(2)').html(testCounter.passed);
        }
        else if(buttonText.slice(0, 6) == 'Failed') {
            $(selectedItem).attr('data-state', 'failed');
            
            testCounter.failed++;
            
            $('#testFailed td:nth-child(2)').html(testCounter.failed);
        }
        else if(buttonText == 'Not Relevant') {
            $(selectedItem).attr('data-state', 'notRelevant');
            
            testCounter.notRelevant++;
            
            $('#testNotRelevant td:nth-child(2)').html(testCounter.notRelevant);
        }
        else if(buttonText == 'Not Tested') {
            $(selectedItem).attr('data-state', 'notTested');
            
            testCounter.notTested++;
            
            $('#testNotTested td:nth-child(2)').html(testCounter.notTested);
        }
        
        $('#testTotal th:nth-child(2)').html(testCounter.passed+testCounter.failed+testCounter.notRelevant+testCounter.notTested);
        
        drawPieChart();

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

    $(document).on('mouseover mouseenter mouseleave', '.polarion-PortalBaseSplitter', function() {
        if($('#ExtraTestMenu').css('display') != 'none') {
        	$('.polarion-PortalBaseSplitter').css('background-color', 'rgb(70, 72, 82)');
        }
    });

    $(document).on("click", "#testCounter", function() {
        $('#testPassed td:nth-child(2)').html('0');
        $('#testFailed td:nth-child(2)').html('0');
        $('#testNotRelevant td:nth-child(2)').html('0');
        $('#testNotTested td:nth-child(2)').html('0');
        $('#testTotal th:nth-child(2)').html('0');
        
        testCounter = {passed: 0, failed: 0, notRelevant: 0, notTested: 0};
        
        drawPieChart();
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
        
        $(selectedItem).attr('data-state', $(this).attr('data-state'));
    });
    
    $(document).on("click", '#testAvTime', function() {
        testTimeArray = [];
         $('#testAvTime').html('Av. time: -');
    });
    
    $(document).on("click", '.selectBox', function() {
        $(this).next().toggle();
    });

    $(document).on("click", '.selectOption', function() {
        var text = $(this).text();
        var selectOptionBox = $(this).parent();
        var selectBox = $(selectOptionBox).prev();
        $(selectBox).children('.selectBoxText').html(text);
        
        $(selectOptionBox).find('.selectOption.selected').removeClass('selected');
        $(this).addClass('selected');
        
        $(selectOptionBox).toggle();
    });
    
    $(document).on("mouseenter", '.svgPie', function() {
        var lastClass = parseInt($(this).attr('class').split(' ').pop(), 10);
        var idArray = ['#testPassed', '#testFailed', '#testNotRelevant', '#testNotTested'];
        var textElment = $(idArray[lastClass]);

        $(textElment).css('font-weight', 'bold');
    });
    
    $(document).on("mouseleave", '.svgPie', function() {
        var lastClass = parseInt($(this).attr('class').split(' ').pop(), 10);
        var idArray = ['#testPassed', '#testFailed', '#testNotRelevant', '#testNotTested'];
        var textElment = $(idArray[lastClass]);

        $(textElment).css('font-weight', '400');
    });
    
    $(document).on("click", '#editView.epIcon', function() {
        var editViewBox = $('#editViewBox');
        $(editViewBox).toggle();
        
        if($(editViewBox).css('display') != 'none') {
            getViews(function(availableViews) {
                var optionsHTML = '';
                for(var i in availableViews) {
                    if(i == 0) {
                        optionsHTML += '<div class="selectOption selected">' + availableViews[i] + '</div>'
                    }
                    else {
                        optionsHTML += '<div class="selectOption">' + availableViews[i] + '</div>'
                    }
                }
                var viewOptions = $('#availableViewOptions');
                $(viewOptions).html('');
                $(viewOptions).append(optionsHTML);
            });
        }
    });
    
    $(document).on("click", '#editViewAdd', function() {
        var viewObject = {panes: $('#availableViewPanes').prev('.selectBox').text(), name: $('#availableViewOptions').prev('.selectBox').text()};
        
        for(var i = 0; i < viewObjects.length; i++) {
            if(viewObjects[i].name == viewObject.name) {
                return;
            }
        }

        viewObjects.push(viewObject);

        createCookie('extraMenu_Views', JSON.stringify(viewObjects), 14);
        
        $('#editViewBox').toggle();
        
        drawViews();
    });
    
    $(document).on("click", '#viewTable .noBlock', function() {
        changeView($(this).attr('data-panes'), $(this).attr('data-name'));
    });
    
    $(document).on("click", '#editViewDelete', function() {
        var viewName = $('#activatedViewOptions').prev('.selectBox').text();
        
        var viewID = -1;
        for(var i = 0; i < viewObjects.length; i++) {
            if(viewObjects[i].name == viewName) {
                viewID = i;
            }
        }

        if(viewID > -1) {
            viewObjects.splice(viewID, 1);
    
            createCookie('extraMenu_Views', JSON.stringify(viewObjects), 1);
            
            drawViews();
        }
        
        $('#editViewBox').toggle();
    });
});

function mainLoop() {
    // make sure the test run check is done in any case
    TestRunCheck(function() {
    	autoClick();
    	addMarkMenu();
    });
}

function runScript() {
    // start the main loop
    startMainLoop();

    // css stuff
    var head = $('head');
    var css = '#ExtraTestMenuButtonShow {background-size:18px;width:18px;height:18px;margin:7px;opacity:0.5;background-image: url(data:image/png;base64,' + menuImage + ');} #ExtraTestMenuButtonShow:hover {cursor: pointer; opacity:1.0;} '
            + '#ExtraTestMenu {display: none; width: 100%; height: 100%;} '
            + '#ExtraTestMenu td {padding: 0;} '
            + '#ExtraTestMenu .action {width: auto; padding: 8px 0px; width: 100%;} #ExtraTestMenu .action:hover {background-image: url(/polarion/ria/images/backgrounds/navigator_dark_bg_selected.png);} '
            + '#ExtraTestMenu .action .icon {display: inline; padding: 0px 5px 0px 20px;} '
            + '#ExtraTestMenu .action .gwt-Label {display: inline-table; vertical-align: middle; margin-left: 6px;} '
            + '#ExtraTestMenu .action .gwt-Image {vertical-align: middle;} '
            + '#ExtraTestMenuButtonHide {border-spacing: 5px;} '
            + '#ExtraTestMenuButtonHide img, #ExtraTestMenuButtonHide div {vertical-align: middle;} '
            + '#ExtraTestMenuButtonHide:hover {cursor: pointer;} '
    		+ '.testMenuItem tr {display: block; margin-left: 10px;} '
    		+ '.testMenuItem .noBlock {display: table-row; margin-left: 0px;} '
    		+ '.testMenuHeadlineBox {margin: 0 5px;} '
    		+ '.testMenuHeadline {position: relative; width: 100%; height: 10px; display: inline-block; -webkit-user-select: none; -moz-user-select: none; user-select: none; margin: 3px 0; padding: 3px 0 0; border-top: 1px solid #929292;} '
    		+ '.testMenuHeadline:hover .arrow {cursor: pointer;} '
    		+ '.testMenuHeadline .arrow {width: 0; height: 0; float: left;} '
    		+ '.testMenuHeadline .arrow.right {margin: 3px 5px; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 5px solid white;} '
    		+ '.testMenuHeadline .arrow.down {margin: 5px 2px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;} '
    		+ '.testMenuHeadlineText {position: absolute; top: 3px; left: 20px;}'
            + '#ItemMarkPopup {display: none; position: absolute; width: 100px; top: 27px; left: 0; background-color: white; border-radius: 2px; border: 1px solid #dedede; -moz-box-shadow: 1px 1px 2px #e0dede; -webkit-box-shadow: 1px 1px 2px #e0dede; box-shadow: 1px 1px 2px #e0dede; font-size: 12px; overflow: auto; z-index: 5;} '
            + '#ItemMarkPopup table {font-weight: bold;} '
            + '.ItemMarkEl {display: table-cell; height: 20px; width: 90px; margin: 2px; vertical-align: middle;} '
            + '.ItemMarkEl:hover {cursor: pointer;} '
            + '.ItemMarkEl[data-state="none"]:hover {background-color: #f5f5f5;} '
            + '.JSTreeTableRow[data-state="passed"], .ItemMarkEl[data-state="passed"] {background-color: #B3EBA2;} .JSTreeTableRow[data-state="passed"]:hover, .ItemMarkEl[data-state="passed"]:hover {background-color: #A6D896;} '
            + '.JSTreeTableRow[data-state="failed"], .ItemMarkEl[data-state="failed"] {background-color: #C94F4F;} .JSTreeTableRow[data-state="failed"]:hover, .ItemMarkEl[data-state="failed"]:hover {background-color: #A73838;} '
            + '.JSTreeTableRow[data-state="notRelevant"], .ItemMarkEl[data-state="notRelevant"] {background-color: #AB61DD;} .JSTreeTableRow[data-state="notRelevant"]:hover, .ItemMarkEl[data-state="notRelevant"]:hover {background-color: #894BB3;} '
            + '.JSTreeTableRow[data-state="notTested"], .ItemMarkEl[data-state="notTested"] {background-color: #D7DD46;} .JSTreeTableRow[data-state="notTested"]:hover, .ItemMarkEl[data-state="notTested"]:hover {background-color: #C3C947;} '
            + '#testAvTime {margin-left: 5px;} '
            + '#testAvTime:hover {cursor: pointer;} '
            + '#ItemMarkMenu {position:relative;} '
            + '#ItemMarkMenuButton:hover {border: 1px solid #cecece;-webkit-box-shadow: 0 0 2px #e0dede;box-shadow: 0 0 2px #e0dede;border-radius: 2px;} '
            + '#testCounter:hover {cursor: pointer;} '
            + '#testCounter td, #testCounter th {padding: 0 5px; text-align: left; display: inline-block; width: 80px;} '
            + '#testCounter td:nth-child(2), #testCounter th:nth-child(2) {width: auto;} '
    		+ '#testCounter tr {margin-left: 0; font-weight: 400;} '
            + '#MenuSeperate {-webkit-user-select: none; position: relative;} '
            + '#MenuSeperate hr {margin: 3px 0; width: 140px;} '
            + '#TestCaseMessage {width: 149px; margin: 2px; padding: 2px;} '
    		+ '.styledSelect {position: relative; width: 155px; margin: 2px; background-color: white; color: black;} '
			+ '.styledSelect .selectOptionBox {font-weight: bold; display: none; position: absolute; z-index: 5; background-color: white; border-radius: 2px; border: 1px solid #dedede; -moz-box-shadow: 1px 1px 2px #e0dede; -webkit-box-shadow: 1px 1px 2px #e0dede; box-shadow: 1px 1px 2px #e0dede; padding: 5px;top: 22px; left: 0; width: 170px;} '
    		+ '.styledSelect .selectOptionBox .selectOption {padding: 5px;} '
			+ '.styledSelect .selectOptionBox .selectOption:hover {background-color: #fff68a; cursor: pointer;} '
			+ '.styledSelect .selectBox {border: 1px solid #c9c9c9; height: 20px;} '
    		+ '.styledSelect .selectBoxText {padding: 2px; display: block;} '
    		+ '.selectBox .selectBoxArrow {float:right;} .selectBox .selectBoxArrow:hover {cursor: pointer;}  '
    		+ '.arrowDown {width: 19px; height: 20px; background-image: url(/polarion/ria/images/combo_box_old.png);} '
    		+ '#pieChart {display: inline-block; width: 100px; height: 75px; padding: 10px;} '
    		+ '.epIcon {width: 15px; height: 15px;} .epIcon:hover {cursor: pointer;}'
			+ '.epIcon.deleteButton {background-image: url("data:image/svg+xml;utf8,' + deleteImage + '");} '
			+ '.epIcon.addButton {background-image: url("data:image/svg+xml;utf8,' + addImage + '");} '
			+ '.epIcon.editButton {background-image: url("data:image/svg+xml;utf8,' + editImage + '");} '
    		+ '.epIcon.epRight {float: right;} '
    		+ '#editViewBox {color: black; display: none; position: absolute; top: 20px; right: 0; width: 180px; z-index: 5; background-color: white; border-radius: 2px; border: 1px solid #dedede; -moz-box-shadow: 1px 1px 2px #e0dede; -webkit-box-shadow: 1px 1px 2px #e0dede; box-shadow: 1px 1px 2px #e0dede; padding: 5px;} '
			+ '#editViewBox .epIcon {margin-top: 5px;} '
    		+ '.editViewHeadline {margin: 10px 0 3px; padding-bottom: 3px; border-bottom: 1px solid #929292; text-align: center;} '
    		+ '.editViewHeadline:first-child {margin: 0 0 3px;} '
    		+ '.editViewLabel {margin: 4px 3px;} '
   			+ '.clearFloat {float: none;}';

    head.append('<style type="text/css">' + css + '</style>');
    
    // set an id for simple use later
    $('.polarion-NavigationPanel').parent('div').attr('id', 'navigationPanel');

    var tbody = $('.polarion-NavigationPanelSettingsShortcuts').children('tbody');
    if(tbody.length == 0) {
        tbody = $('.polarion-NavigationPanelSettingsShortcuts');
    }
    tbody.children('tr').append('<td><div id="ExtraTestMenuButtonShow"></div></td>');
    
    var testMenuItemDisplays = {Description: {display: '', arrow: 'down'}, AutoClick: {display: '', arrow: 'down'}, View: {display: ' style="display: none;"', arrow: 'right'}, Statistics: {display: ' style="display: none;"', arrow: 'right'}};
    var testMenuItemDisplaykeys = Object.keys(testMenuItemDisplays); 
    for(var i = 0; i < testMenuItemDisplaykeys.length; i++) {
        var key = testMenuItemDisplaykeys[i];
        if(readCookie('extraMenu_' + key) == '0') {
            testMenuItemDisplays[key].display = ' style="display: none;"';
            testMenuItemDisplays[key].arrow = 'right';
        }
        else if(readCookie('extraMenu_' + key) == '1') {
            testMenuItemDisplays[key].display = '';
            testMenuItemDisplays[key].arrow = 'down';
        }
    }
    
    var viewObjectsCookie = readCookie('extraMenu_Views');
    if(viewObjectsCookie != null) {
    	viewObjects = JSON.parse(viewObjectsCookie);
        
        // refresh cookie
        createCookie('extraMenu_Views', JSON.stringify(viewObjects), 14);
    }

    var menuHtml = '<table id="ExtraTestMenuButtonHide">'
    					+ '<tr>'
    						+ '<td><img src="/polarion/ria/images/portal/settings_on.png"></td>'
    						+ '<td><div>Hide</div></td>'
    						+ '<td><img src="/polarion/ria/images/portal/button_arrow_up.png"></td>'
    					+ '</tr>'
    				+ '</table>'
    				+ '<div class="testMenuHeadlineBox"><div class="testMenuHeadline"><div class="arrow ' + testMenuItemDisplays.Description.arrow + '"></div><div class="testMenuHeadlineText">Description</div></div></div>'
    				+ '<div class="testMenuItem"' + testMenuItemDisplays.Description.display + '>'
    				+ '<table style="width: 100%; border-spacing: 0;">'
    					+ '<tr class="noBlock" id="ExpandDescription">'
    						+ '<td>'
    							+ '<div class="action">'
    								+ '<div class="icon"><img src="data:image/png;base64,' + descriptionImage + '" class="gwt-Image"></div>'
    								+ '<div class="gwt-Label">Description (off)</div>'
    							+ '</div>'
    						+ '</td>'
    					+ '</tr>'
    				+ '</table>'
    				+ '</div>'
    				+ '<div class="testMenuHeadlineBox"><div class="testMenuHeadline"><div class="arrow ' + testMenuItemDisplays.AutoClick.arrow + '"></div><div class="testMenuHeadlineText">AutoClick</div></div></div>'
    				+ '<div class="testMenuItem"' + testMenuItemDisplays.AutoClick.display + '>'
    				+ '<table style="width: 100%; border-spacing: 0;">'
    					+ '<tr class="noBlock" id="AutoClick" data-state="off">'
    						+ '<td>'
    							+ '<div class="action">'
    								+ '<div class="icon"><img src="data:image/png;base64,' + autoClickImage + '" class="gwt-Image"></div>'
    								+ '<div class="gwt-Label">AutoClick (off)</div>'
    							+ '</div>'
    						+ '</td>'
    					+ '</tr>'
    					+ '<tr class="noBlock" id="AutoTestrun" data-state="on">'
    						+ '<td>'
    							+ '<div class="action">'
    								+ '<div class="icon"><img src="data:image/png;base64,' + autoClickImage + '" class="gwt-Image"></div>'
    								+ '<div class="gwt-Label">AutoTestrun (on)</div>'
    							+ '</div>'
    						+ '</td>'
    					+ '</tr>'
                    + '</table>'
    				+ '<table style="width: 100%; padding: 4px;">'
                        + '<!--<tr><td><input id="AutoClickButton" type="text" placeholder="Buttontext"/></td></tr>-->'
    					+ '<tr><td>'
    						+ '<div class="styledSelect">'
                              	+ '<div class="selectBox"><span class="selectBoxArrow arrowDown"></span><span id="AutoClickButton" class="selectBoxText">Passed</span><div class="clearFloat"></div></div>'
                                + '<div class="selectOptionBox">'
                                    + '<div class="selectOption selected">Passed</div>'
                                    + '<div class="selectOption">Failed Always</div>'
                                    + '<div class="selectOption">Failed Often</div>'
    								+ '<div class="selectOption">Failed Several Times</div>'
    								+ '<div class="selectOption">Failed Once</div>'
    								+ '<div class="selectOption">Not Relevant</div>'
    								+ '<div class="selectOption">Not Tested</div>'
                                + '</div>'
                            + '</div>'
    					+ '</td></tr>'
                        + '<tr><td><textarea id="TestCaseMessage" placeholder="Test case comment"></textarea></td></tr>'
                        + '<tr><td>'
                            + '<form>'
                                + '<input type="radio" name="testSetting" value="pause" checked="True">Pause at headline<br>'
                                + '<input type="radio" name="testSetting" value="skip">Skip headlines<br>'
                                + '<input type="radio" name="testSetting" value="stop">Stop at headline'
                            + '</form>'
                        + '</td></tr>'
    				+ '</table>'
    				+ '</div>'
    				+ '<div class="testMenuHeadlineBox"><div class="testMenuHeadline">'
    					+ '<div id="editView" class="epIcon editButton epRight"></div><div class="clearFloat"></div>'
    					+ '<div id="editViewBox">'
    						+ '<div class="editViewHeadline">Add view</div>'
    						+ '<div class="editViewLabel">Tile panes:</div>'
    						+ '<div class="styledSelect">'
                                + '<div class="selectBox"><span class="selectBoxArrow arrowDown"></span><span class="selectBoxText">Vertical</span></div>'
                                + '<div id="availableViewPanes" class="selectOptionBox">'
    								+ '<div class="selectOption selected">Vertical</div>'
    								+ '<div class="selectOption selected">Horizontal</div>'
    							+ '</div>'
                            + '</div>'
    						+ '<div class="editViewLabel">View:</div>'
    						+ '<div id="editViewAdd" class="epIcon addButton epRight"></div>'
                            + '<div class="styledSelect">'
                                + '<div class="selectBox"><span class="selectBoxArrow arrowDown"></span><span class="selectBoxText">Default</span><div class="clearFloat"></div></div>'
                                + '<div id="availableViewOptions" class="selectOptionBox"></div>'
                            + '</div>'
    						+ '<div class="editViewHeadline">Delete view</div>'
    						+ '<div class="editViewLabel">View:</div>'
    						+ '<div id="editViewDelete" class="epIcon deleteButton epRight"></div>'
    						+ '<div class="styledSelect">'
                                + '<div class="selectBox"><span class="selectBoxArrow arrowDown"></span><span class="selectBoxText"></span><div class="clearFloat"></div></div>'
                                + '<div id="activatedViewOptions" class="selectOptionBox">'
    							+ '</div>'
                            + '</div>'
    					+ '</div>'
    					+ '<div class="arrow ' + testMenuItemDisplays.View.arrow + '"></div><div class="testMenuHeadlineText">View</div><div class="clearFloat"></div></div></div>'
    				+ '<div class="testMenuItem"' + testMenuItemDisplays.View.display + '>'
    				+ '<table id="viewTable" style="width: 100%; border-spacing: 0;">'
    				+ '</table>'
    				+ '</div>'
    				+ '<div class="testMenuHeadlineBox"><div class="testMenuHeadline"><div class="arrow ' + testMenuItemDisplays.Statistics.arrow + '"></div><div class="testMenuHeadlineText">Statistics</div></div></div>'
    				+ '<div class="testMenuItem"' + testMenuItemDisplays.Statistics.display + '>'
    				+ '<table style="width: 100%; padding: 4px;">'
                        + '<tr><td><div id="testAvTime">Av. time: -</div></td></tr>'
    					+ '<tr class="noBlock"><td id="MenuSeperate"><div class="polarion-SettingsSeparator" style="height: 1px; margin: 5px 6px 5px 15px;"></div></td></tr>'
    					+ '<tr><td><table id="testCounter" style="border-spacing: 0;">'
                            + '<tr id="testPassed"><td>Passed</td><td>0</td></tr>'
                            + '<tr id="testFailed"><td>Failed</td><td>0</td></tr>'
                            + '<tr id="testNotRelevant"><td>Not relevant</td><td>0</td></tr>'
                            + '<tr id="testNotTested"><td>Not tested</td><td>0</td></tr>'
    						+ '<tr id="testTotal"><th>Total</th><th>0</th></tr>'
    					+ '</table></td></tr>'
    					+ '<tr><td>'
    						+ '<div id="pieChart">'
                                + '<svg width="100%" height="100%" id="s" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 400 400">'
    								+ '<style type="text/css">path:hover, circle:hover {opacity: 0.8;}</style>'
                                + '</svg>'
                            + '</div>'
    					+ '</td></tr>'
                    + '</table>'
    				+ '</div>';
    
    //var menu = $('#ExtraTestMenu');
    var menu = $('#navigationPanel');
    $(menu).append('<div id="ExtraTestMenu" class="polarion-SettingsPanel">' + menuHtml + '</div>');
    
    drawViews();
}

function autoClick() {
    if(!autoClickActive || messageActive) {
        return;
    }

    var AutoClickButton = $('#AutoClickButton').text();

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

function TestRunCheck(callback) {
    var testRunElement = $(".polarion-JSPreviewPanelTitle:contains('Execute Test')");
    if(!testRunElement.length) {
        callback();
        return;
    }

    var ID = $(".polarion-JSPreviewPanelTitle:contains('Execute Test')").attr('id');
    
    if(LastTestID == ID) {
        callback();
        return;
    }
    
	var comboText = $('.polarion-ExecuteTest-combo').text();
    var index = comboText.indexOf('(')-1;
    if(index == -1 || !comboText.length || !searchLineText.length) {
        callback();
        return;
    }

    LastTestID = ID;

    comboText = comboText.substring(0, index);
    
    if(comboText != searchLineText) {
        if(autoTestrunActive) {
            selectTestrun(function() {
                callback();
            });
        }
        else {
            showTestrunMessage();
            var button = $('#AutoClick');
            if($(button).attr('data-state') == 'on') {
                stopAutoClick();
            }
            callback();
        }
    }
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
