sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log",
    "sap/ui/thirdparty/URI"

],
    /**
     * 
     * @param( typeof sap.ui.core.util.MockServer) MockServer
     * @param( typeof sap.ui.model.json.JSONModel) JSONModel
     * @param( typeof sap.base.util.UriParameters) UriParameters
     * @param( typeof sap.base.Log) Log
     * @param(typeof sap.URI.thirdparty.URI) URI
     
     * 
     */

    function (MockServer, JSONModel, UriParameters, Log,URI) {
        "use strict";
        var oMockServer,
            _sAppPath = "project1/SAPUI5/",
            _sJsonFilesPath = _sAppPath + "localServices/mockdata";

        var oMockServerInterface = {

            /**
             * Initializes the mock server asynchronously
             * @protected
             * @param {
             * } oOptionsParameter 
             * @returns{Promise} a promise that is resolved when the mock server has been started
             */

            init: function (oOptionsParameter) {
                var oOptions = oOptionsParameter || {};

                return new Promise(function (fnResolver, fnReject) {
                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function () {
                        var oUriParameters = new UriParameters(window.location.href);
                        //parse manifest for local metadata URI

                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        //ensure there is a trailling slash

                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();
                        //create mock server instance or stop the existing one to reinitialize

                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            });
                        } else {
                            oMockServer.stop();
                        }

                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)

                        });

                        //simulate all request using mock data

                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true


                        });

                        var aRequest = oMockServer.getRequests();

                        // compose an error response for each request
                        var fnResponse = function (iErrCode, sMessage, aRequest) {
                            aRequest.response = function (oXhr) {
                                oXhr.respond(iErrCode, { "Content-Type": "text/plain,charset=utf-8" }, sMessage);
                            };
                        };

                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequest.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexOf("$metadata") > -1) {
                                    fnResponse(500, "metadata Error", aEntry);

                                }


                            });
                        };

                        //simulate request errors

                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequest.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        };

                        // set requests and start the server

                        oMockServer.setRequests(aRequest);
                        oMockServer.start();

                        Log.info("Running the app with mock data");
                        fnResolver();


                    });

                    oManifestModel.attachRequestFailed(function () {
                        var sError = "Failed to load the application manifest";

                        Log.error(sError);
                        fnReject(new Error(sError));
                    });

                });

            }

        };

        return oMockServerInterface


    })