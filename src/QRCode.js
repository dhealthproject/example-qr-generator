/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
const getDappByName = (dapp) => {
  if ("dHealthTechChats" === dapp) return "NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I";
  if ("dHealthClaimPool" === dapp) return "NDEVOV2ZC22WWO5TZ6HKG7VVCFMW5EIXRW2DMMY";

  // by default dHealth Tech Chats
  return "NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I";
};

const getNoteByInput = (note) => {
  if (note.length) return note;

  // by default claim NFT
  return "I claim that I wish to receive dHealth's NFT";
};

const getTransactionRequest = (type, dapp, note) => {
  if (type === "claim") {
    return _SDK.TransferTransaction.create(
      _SDK.Deadline.create(_CTRL.options.network.epochAdjustment),
      _SDK.Address.createFromRawAddress(getDappByName(dapp)),
      [new _SDK.Mosaic(new _SDK.MosaicId("39E0C49FA322A459"), _SDK.UInt64.fromUint(0))],
      _SDK.PlainMessage.create(note),
      _SDK.NetworkType.MAIN_NET,
      _SDK.UInt64.fromUint(0),
    );
  }

  // unrecognized type: default "Welcome"
  return _SDK.TransferTransaction.create(
    _SDK.Deadline.create(_CTRL.options.network.epochAdjustment),
    _SDK.Address.createFromRawAddress(getDappByName(dapp)),
    [new _SDK.Mosaic(new _SDK.MosaicId("39E0C49FA322A459"), _SDK.UInt64.fromUint(0))],
    _SDK.PlainMessage.create("I am testing dHealth Network."),
    _SDK.NetworkType.MAIN_NET,
    _SDK.UInt64.fromUint(0),
  );
};

const createTransactionQR = () => {
  // read form
  let type = document.getElementById("type-selector").value;
  let dapp = document.getElementById("dapp-selector").value;
  let note = document.getElementById("message-input").value;

  // prepare transaction and QR
  let transaction = getTransactionRequest(type, dapp, note);
  let qrCode = _QRLIB.QRCodeGenerator.createTransactionRequest(
    transaction,
    _SDK.NetworkType.MAIN_NET,
    _CTRL.options.network.generationHash,
  );

  // display qr
  let qrElm = document.querySelector('[id="qr-code-wrapper"]');
  let img = document.createElement("img");

  qrCode.toBase64().toPromise().then((base64) => {
    img.setAttribute("src", base64);
  });

  qrElm.appendChild(img);
};

window.YourDLT = Object.assign({}, window.YourDLT ?? {}, {
  createTransactionQR,
});
