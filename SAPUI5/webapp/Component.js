sap.ui.define([
    "sap/ui/core/UIComponent",
    "project1/SAPUI5/model/Models",
    "sap/ui/model/resource/ResourceModel"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.resource.ResourceModel}ResourceModel
     */

    function (UIComponent, Models, ResourceModel) {
        return UIComponent.extend("project1.SAPUI5.Component", {

            metadata: {
                manifest: "json"
                // "rootView": {
                //     "viewName": "project1.SAPUI5.view.App",
                //     "type": "XML",
                //     "async":true,
                //     "id": "app"
                // }
            },


            init: function () {
                //Llamada a init padre
                UIComponent.prototype.init.apply(this, arguments);

                // Set DataModel
                this.setModel(Models.createRecipient());
                //Set i18n
                var i18nModel = new ResourceModel({ bundleName: "project1.SAPUI5.i18n.i18n" });
                this.setModel(i18nModel, "i18n");



            }
        });
    });