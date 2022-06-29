/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

const dHealth_generationHash = "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16";

const createTransactionQR = () => {
  let qrCode = _QRLIB.QRCodeGenerator.createTransactionRequest(_SDK.TransferTransaction.create(
    _SDK.Deadline.create(_CTRL.options.network.epochAdjustment),
    _SDK.Address.createFromRawAddress("NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I"),
    [new _SDK.Mosaic(new _SDK.MosaicId("39E0C49FA322A459"), _SDK.UInt64.fromUint(0))],
    _SDK.PlainMessage.create("Testing transaction QR"),
    _SDK.NetworkType.MAIN_NET,
    _SDK.UInt64.fromUint(0),
  ), _SDK.NetworkType.MAIN_NET, dHealth_generationHash);

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
