//	Javascript file for the WeatherCenter gadget
//	(c) 2009
//	WeatherCenter Gadget Team
//	Development: hadj 
//	Graphics: Tex
//	Testing: Digital	
////////////////////////////////////////////////////////////////////////



function WUndergroundLoadSettings()
{
	WUndergroundCityFlag = 0;

	loccode.value = System.Gadget.Settings.read("WUlastSearch");
	loccode_id.value = System.Gadget.Settings.read("WUlocationCode");


	updateInt[0].disabled=false;
	if (System.Gadget.Settings.read("WUupdateInterval") == "0") updateInt[0].checked = "1";
	else {
		updateInt[1].checked = "1";
		updateIntValue.value = System.Gadget.Settings.read("WUupdateInterval");
	}

		
	WUUnits_makeUnitSelector("ShowParametersOption1");
	WUUnits_makeUnitSelector("ShowParametersOption2");
	WUUnits_makeUnitSelector("ShowParametersOption3");
	WUUnits_makeUnitSelector("ShowParametersOption4");
	
}



/////////////////


function WUUnits_makeUnitSelector(ShowParametersOption)
{
var unitsArray = [
		{"name":lng_Stats["nothing"], "value":"nothing"},
		{"name":lng_Stats["wind"], "value":"wind"},
		{"name":lng_Stats["humidity"], "value":"humidity"},
		{"name":lng_Stats["pressure"], "value":"pressure"},
		{"name":lng_Stats["precipitation"], "value":"precipitation"},
		{"name":lng_Stats["visibility"], "value":"visibility"},
		{"name":lng_Stats["sunrise"], "value":"sunrise"},
		{"name":lng_Stats["sunset"], "value":"sunset"},
		{"name":lng_Stats["dewpoint"], "value":"dewpoint"},
		{"name":lng_Stats["moonterminator"], "value":"moonterminator"},
		{"name":lng_Stats["latitude"], "value":"latitude"},
		{"name":lng_Stats["longitude"], "value":"longitude"}
		]


for (i = 0; i < unitsArray.length; i++)
	{
		var sel = document.getElementById(ShowParametersOption);
		var opt = document.createElement("option");
		opt.value = unitsArray[i].value;
		opt.innerHTML = unitsArray[i].name;
		if (unitsArray[i].value == System.Gadget.Settings.read("WU"+ShowParametersOption)) opt.selected = true; 
		sel.appendChild(opt);
	}
} 


/////////////////



function WUndergroundSearchCityCode(LocCode)
{
	var location = "http://api.wunderground.com/auto/wui/geo/GeoLookupXML/index.xml?query=" + LocCode;

	clearResults();

	var tmp = new ActiveXObject("Microsoft.XMLHTTP");
	tmp.open("GET", location, true);
	tmp.onreadystatechange=function()
	{
		if (tmp.readyState==4)
			{
				if (tmp.Status == 200) WUndergroundParseCityResults(tmp.responseText);
				else {document.getElementById("loccode").value = lng_NoData; return;}
			}
	}
	tmp.Send(null);
}




function WUndergroundSearchStationCode()
{
	show("load_indicator");

	var location = "http://api.wunderground.com/auto/wui/geo/GeoLookupXML" + loccode_id.value;

	clearResults();

	var tmp = new ActiveXObject("Microsoft.XMLHTTP");
	tmp.open("GET", location, true);
	tmp.onreadystatechange=function()
	{
		if (tmp.readyState==4)
			{
				if (tmp.Status == 200) WUndergroundParseStationResults(tmp.responseText);
				else {document.getElementById("loccode").value = lng_NoData; return;}
			}
	}
	tmp.Send(null);
}
//////////////////


function WUndergroundParseCityResults(xmlData)
{
	
	code = xmlData.split('<location type=');

	if (code.length == 2)
	{
		var option = document.createElement("OPTION");
		option.value = code[1].substring(code[1].indexOf("<city>") + 6, code[1].indexOf("</city>"));
		option.innerText = code[1].substring(code[1].indexOf("<city>") + 6, code[1].indexOf("</city>")) + ", " + code[1].substring(code[1].indexOf("<country>") + 9, code[1].indexOf("</country>"));
		results.appendChild(option);
	}

	else
	{
		for (var i = 1; i < code.length; i++)
		{
			var option = document.createElement("OPTION");
			option.value=code[i].substring(code[i].indexOf("<name>") + 6, code[i].indexOf("</name>"));
			option.innerText=code[i].substring(code[i].indexOf("<name>") + 6, code[i].indexOf("</name>"));
			results.appendChild(option);
		}
	}

hide("load_indicator");

}






function WUndergroundParseStationResults(xmlData)
{
	
	code_airport = xmlData.substring(xmlData.indexOf("<airport>") + 9, xmlData.indexOf("</airport>"));
	code = code_airport.split('<station>');

	for (var i = 1; i < code.length; i++)
	{
		var option = document.createElement("OPTION");
		option.value=code[i].substring(code[i].indexOf("<icao>") + 6, code[i].indexOf("</icao>"));
		option.innerText= code[i].substring(code[i].indexOf("<icao>") + 6, code[i].indexOf("</icao>")) + ": " + code[i].substring(code[i].indexOf("<city>") + 6, code[i].indexOf("</city>"));
		results.appendChild(option);
		
	}
hide("load_indicator");
}



function removeCDATA(datastr)
{
datastr = datastr.slice(datastr.indexOf('<![CDATA[') + 9, datastr.indexOf(']]>'));

return datastr;
}

/////////////////////

