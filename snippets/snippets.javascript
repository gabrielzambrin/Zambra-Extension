{
	"Create new action": {
		"prefix": "newaction",
		"body": [
			"var action = component.get(\"c.${1:getAction}\");",
			"action.setParams({ recordId : component.get(\"v.recordId\") });",
			"action.setCallback(this, function (response) {",
			"  var state = response.getState();",
			"  if (state === \"SUCCESS\") {",
			"    component.set('v.${2:dataSet}', response.getReturnValue());",
			"  } else if (state === \"ERROR\") {",
			"    var errors = response.getError();",
			"    console.error(errors);",
			"  }",
			"});",
			"${var:$}A.enqueueAction(action);$0"
		],
		"description": "Create new action"
	},
	"Create new function": {
		"prefix": "newfunction",
		"body": [
			"${1:newFunction} : function(${2:component}, ${3:event}, ${4:helper}) {",
			"\t$5",
			"}$0"
		],
		"description": "Create new function"
	},
	"Generate toast event": {
		"prefix": "toast",
		"body": [
			"var toastEvent = ${var:$}A.get(\"e.force:showToast\");",
			"toastEvent.setParams({",
			"  \"title\": \"${1:title}\",",
			"  \"message\": \"${2:message}\",",
			"  \"type\": \"${3|success,error,warning|}\"",
			"});",
			"toastEvent.fire();",
			"$0"
		],
		"description": "Generate toast event"
	}
}