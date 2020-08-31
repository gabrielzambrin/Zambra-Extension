{
    "Print to console": {
		"prefix": "debug",
		"body": [
			"System.debug('$1');",
			"$0"
		],
		"description": "Log output to console"
	},
    "Create region": {
		"prefix": "region",
		"body": [
			"$LINE_COMMENT #region $1",
			"$TM_SELECTED_TEXT",
			"$LINE_COMMENT #endregion",
			"$0"
		],
		"description": "Create a region block"
	},
	"Extract Method": {
		"prefix": "extractMethod",
		"body": [
			"${1|global,public,private|} ${2:static} ${3:void} ${4:MethodName}(${5:String} ${6:param}){",
			"\t$CLIPBOARD",
			"}",
			"$0"
		],
		"description": "Extract selected text to new method"
    },
    "Get Object List" : {
		"prefix": "getListObjQuery",
		"body": [
			"${1|global,public,private|} ${2:static} List<SObject> ${3:MethodName}(String ${4:objectName}, Set<String> ${5:fields}, String ${6:whereClause}, String ${7:orderBy}, Integer ${8:limitQuery}){",
			"\tif(String.isNotBlank(${4:objectName})){",
			"\t\tString query = 'SELECT ' + String.join(new List<String>(${5:fields}), ',') + ' FROM ' + ${4:objectName};",
			"\t\tquery += (String.isNotBlank(${6:whereClause})) ? ' WHERE ' + ${6:whereClause} : '';",
			"\t\tquery += (String.isNotBlank(${7:orderBy})) ? ' ORDER BY ' + ${7:orderBy} : '';",
			"\t\tquery += (${8:limitQuery} != null) ? ' LIMIT ' + ${8:limitQuery} : '';",
			"\t\treturn Database.query(query);",
			"\t}else {",
			"\t\treturn null;",
			"\t}",
			"}",
			"$0"
		],
		"description": "Method to return object list."
	},
	"Get All Fields Set":{
		"prefix": "getAllFieldsSet",
		"body": [
			"${1|global,public,private|} ${2:static} Set<String> ${3:MethodName}(String ${4:objectName}){",
			"\tSet<String> fieldNames = new Set<String>();",
			"\tfor(String s : Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().keySet()) {",
			"\t\tif(Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().get(s).getDescribe().isAccessible()) {",
			"\t\t\tfieldNames.add(s);",
			"\t\t}",
			"\t}",
			"\treturn fieldNames;",
			"}",
			"$0"
		],
		"description": "Method to return all fields of an object in a Set<String>"
	},
	"Get All Fields String":{
		"prefix": "getAllFieldsString",
		"body": [
			"${1|global,public,private|} ${2:static} String ${3:MethodName}(String ${4:objectName}){",
			"\tSet<String> fieldNames = new Set<String>();",
			"\tfor(String s : Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().keySet()) {",
			"\t\tif(Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().get(s).getDescribe().isAccessible()) {",
			"\t\t\tfieldNames.add(s);",
			"\t\t}",
			"\t}",
			"\treturn String.join(new List<String>(fieldNames),',');",
			"}",
			"$0"
		],
		"description": "Method to return all fields of an object in a string, separated by ','"
	},
	"Get PickList Values":{
		"prefix": "getPicklist",
		"body": [
			"${1|global,public,private|} ${2:static} List<String> ${3:MethodName}(String ${4:objectName}, String ${5:fieldName}){",
			"\tList<String> pickList = new List<String>();",
			"\tfor(Schema.PicklistEntry entry:  Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().get(${5:fieldName}).getDescribe().getPickListValues()) {",
			"\t\tpickList.add(entry.${6|getValue(),getLabel()|});",
			"\t}",
			"\treturn pickList;",
			"}",
			"$0"
		],
		"description": "Method to return actives picklist API Names or Values(Label)"
	},
	"Get Map PickList":{
		"prefix": "getPicklistMap",
		"body": [
			"${1|global,public,private|} ${2:static} Map<String,String> ${3:MethodName}(String ${4:objectName}, String ${5:fieldName}){",
			"\tMap<String, String> pickListMap = new Map<String, String>();",
			"\tfor(Schema.PicklistEntry entry:  Schema.getGlobalDescribe().get(${4:objectName}).getDescribe().fields.getMap().get(${5:fieldName}).getDescribe().getPickListValues()) {",
			"\t\tpickListMap.put(entry.getValue(), entry.getLabel());",
			"\t}",
			"\treturn pickListMap;",
			"}",
			"$0"
		],
		"description": "Method to return actives picklist map"
	},
	"Get RecordTypeID":{
		"prefix": "getRecordTypeId",
		"body": [
			"Schema.Sobjecttype.${1:Account}.${2|getRecordTypeInfosByDeveloperName(),getRecordTypeInfosByName()|}.get('${3:RecordTypeName}').getRecordTypeId()$0"
		],
		"description": "Get recordtype id of an Object"
	}

}