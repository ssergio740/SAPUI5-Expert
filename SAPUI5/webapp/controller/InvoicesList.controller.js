// @ts-nocheck
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    '../model/InvoicesFormatter'

],
 
/**
 * 
 * @param { typeof sap.ui.core.mvc.Controller} Controller 
 * @param { typeof sap.ui.model.json.JSONModel} JSONModel

 */


function(Controller, JSONModel,InvoicesFormater) {
    return Controller.extend("project1.SAPUI5.controller.InvoicesList",{
        formatter : InvoicesFormater,
        onInit: function () {
            var oViewModel = new JSONModel({
                usd:"USD",
                eur:"EUR"

            });
            this.getView().setModel(oViewModel,"currency");

        }

    });


});
