/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Examples
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// network compatibility dependency
const _SDK = require('/node_modules/dhealth-sdk');
const _QRLIB = require('/node_modules/dhealth-qr-library'); // QRCode.js

// globally managed state
let _STORE = null,
    _NODES = null,
    _NODE = null,
    _CTRL = null;

/**
 * @class YourDLT.Controller
 * @package YourDLT
 * @description The controller class controls the repository and view.
 * @author Gregory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license AGPL-3.0
 * @link https://yourdlt.tools
 */
class Controller {
  constructor(nodeUrl, options = {}) {
    // symbol network compatibility
    this.network = {
      networkType: options.networkType ?? _SDK.NetworkType.MAIN_NET,
      generationHash: options.generationHash ?? 'ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16',
      epochAdjustment: options.epochAdjustment ?? 1616978397,
    };

    // augment options with resolved network details
    this.options = Object.assign({}, options, {
      network: this.network,
    });

    // localStorage namespace and node details
    this.namespace = options.namespace ?? 'yourdlt/ninja';
    this._NODE_URL = nodeUrl;
    this._WS_URL   = nodeUrl.replace(/^https?:\/\//, 'ws://') + '/ws';
    this._HOST     = nodeUrl.replace(/^https?:\/\//, '').replace(':3000', '');

    // having `nodePublicKey` set in options avoids 1 /node/info request
    this._ADAPTER = new _SDK.RepositoryFactoryHttp(this._NODE_URL, {
      ...this.network,
      websocketUrl: this._WS_URL,
      websocketInjected: WebSocket, // inject browser websocket api
      nodePublicKey: options.nodePublicKey ?? null,
    });

    // initial database fetch/creation
    _STORE = new Storage(this.namespace, this.network);
    _NODES = _STORE.birth ? {
      [this.options.identityPublicKey]: {
        publicKey: this.options.identityPublicKey,
        nodePublicKey: this.options.nodePublicKey,
        host: this._HOST,
        port: 7900,
      }
    } : _STORE.dict('nodes');
    _CTRL = this; // once globally
  };

  async connect() {
    // query node info from REST
    const nodeInfo = await Repository.getNodeInfo(this._ADAPTER).toPromise();
    if (!nodeInfo.host.length) nodeInfo.host = this._HOST;

    // store for later use
    _NODE = nodeInfo.publicKey;
    _NODES[_NODE] = nodeInfo;
    _STORE.push('nodes', nodeInfo, {pk: 'publicKey'});

    // read block height and connect websockets
    Repository.getChainInfo(this._ADAPTER);
  };
}

// helpers
const readNetwork = (url, options = {}) => {
  // use internal traits
  controller = new Controller(url, options);

  // connect to network
  return controller.connect()
};

const setupUI = () => {
  /// region theme-toggle
  // let themer = document.querySelector('[name="toggleTheme"]');
  // themer.addEventListener('click', (e) => {
  //   let checked = e.target.getAttribute('checked'),
  //       body = document.querySelector('body'),
  //       nextTheme = 'light';
  //   if (null === checked) nextTheme = 'dark';

  //   // reset ui
  //   if (nextTheme === 'light') body.classList.remove('dark');
  //   else body.classList.remove('light');

  //   // set next theme
  //   body.classList.add(nextTheme);
  //   e.target.classList.toggle('checked');

  //   if (null !== checked) e.target.removeAttribute('checked');
  //   else e.target.setAttribute('checked', '');

  //   localStorage.setItem('yourdlt/theme', nextTheme);
  // });
  /// end-region theme-toggle

  /// region modal box openers
  let togglers = document.querySelectorAll('[data-toggle]');

  for (let j = 0, m = togglers.length; j < m; j++) {
    togglers[j].addEventListener('click', (e) => {
      e.preventDefault();
      let msel = e.target.getAttribute('data-toggle');
      View.toggleModal(msel);
    });
  }
  /// end-region modal box openers

  /// region tooltip openers
  let tippers = document.querySelectorAll('[data-tooltip]');

  for (let j = 0, m = tippers.length; j < m; j++) {
    tippers[j].addEventListener('click', (e) => {
      e.preventDefault();
      let msel = e.target.getAttribute('data-tooltip');
      View.toggleTooltip(msel);
    });
  }
  /// end-region tooltip openers
};

window.YourDLT = {
  readNetwork,
  setupUI,
  createTransactionQR,
};
