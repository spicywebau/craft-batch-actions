(()=>{"use strict";var t={973:(t,e,n)=>{n.r(e)},128:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.NeoBatchActionBar=e.MatrixBatchActionBar=void 0;class n{constructor(t,e,n){this.input=t,this.blockClass=e,this.blockSelectedClass=n,this.$bar=$('<div class="block-batch-action-bar"/>').prependTo(t.$container),this.$buttons=this._generateButtons().prependTo(this.$bar),this.$menuContainer=this._generateMenu().prependTo(this.$bar);const a=this.$bar.add(this.$menu);a.find('[data-bba-bn="button.expand"]').on("activate",(t=>{t.preventDefault(),this.expand(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.collapse"]').on("activate",(t=>{t.preventDefault(),this.collapse(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.enable"]').on("activate",(t=>{t.preventDefault(),this.enable(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.disable"]').on("activate",(t=>{t.preventDefault(),this.disable(this.getSelectedBlocks())})),a.find('[data-bba-bn="button.delete"]').on("activate",(t=>{t.preventDefault(),this.delete(this.getSelectedBlocks())}))}supportedActions(){return[["Expand","expand"],["Collapse","collapse"],["Enable","enabled"],["Disable","disabled"],["Delete","remove"]]}_generateButtons(){const t=$('<div class="btngroup"/>');return this.supportedActions().forEach((([e,n])=>this._generateAction(e,n,"btn").appendTo(t))),t}_generateMenu(){var t;const e=$('<div class="block-batch-action-menu hidden"/>'),n=$('<button type="button" class="btn settings icon menubtn">Actions</button>').appendTo(e);this.$menu=$('<div class="menu"/>').appendTo(e);const a=$('<ul class="padded"/>').appendTo(this.$menu);this.supportedActions().forEach((([t,e])=>$("<li/>").append(this._generateAction(t,e)).appendTo(a))),n.menubtn();let o=null!==(t=this.$buttons.width())&&void 0!==t?t:0;return this.$bar.on("resize",(()=>{var t,n;o||(o=null!==(t=this.$buttons.width())&&void 0!==t?t:0);const a=(null!==(n=this.$bar.width())&&void 0!==n?n:0)<o;this.$buttons.toggleClass("hidden",a),e.toggleClass("hidden",!a)})),e}_generateAction(t,e,n){const a=void 0!==n,o=t.toLowerCase();null!=e||(e=o);const s=$(`<${a?"button":"a"}/>`).attr({"aria-label":t,"data-bba-bn":`button.${o}`,"data-icon":e}).text(t);return a&&s.addClass(n),s}expand(t){t.forEach((t=>t.expand()))}collapse(t){t.forEach((t=>t.collapse()))}}e.MatrixBatchActionBar=class extends n{constructor(t){super(t,"matrixblock","sel"),this.input=t}getSelectedBlocks(){return this.input.$container.find(`.${this.blockClass}.${this.blockSelectedClass}`).map(((t,e)=>$(e).data("block"))).get()}enable(t){t.forEach((t=>t.enable()))}disable(t){t.forEach((t=>t.disable()))}delete(t){window.confirm("Are you sure you want to delete the selected blocks?")&&t.forEach((t=>t.selfDestruct()))}},e.NeoBatchActionBar=class extends n{constructor(t){super(t,"ni_block","is-selected"),this.input=t}getSelectedBlocks(){return this.input.getBlocks().filter((t=>t.isSelected()))}enable(t){var e;null===(e=t.find((t=>!t.isEnabled())))||void 0===e||e.enable()}disable(t){var e;null===(e=t.find((t=>t.isEnabled())))||void 0===e||e.disable()}delete(t){window.confirm("Are you sure you want to delete the selected blocks?")&&t.forEach((t=>this.input.removeBlock(t)))}}}},e={};function n(a){var o=e[a];if(void 0!==o)return o.exports;var s=e[a]={exports:{}};return t[a](s,s.exports,n),s.exports}n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{const t=n(128);n(973);const e=[];Garnish.on(Craft.MatrixInput,"afterInit",(n=>{e.push(new t.MatrixBatchActionBar(n.target))})),void 0!==(null===Neo||void 0===Neo?void 0:Neo.Input)&&Garnish.on(Neo.Input,"afterInit",(n=>{e.push(new t.NeoBatchActionBar(n.target))}))})()})();
//# sourceMappingURL=main.js.map