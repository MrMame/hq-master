import{a as dt}from"./chunk-35HOOFHY.js";import{h as lt,s as mt,v as ct,x as ut}from"./chunk-CWPZ4YWQ.js";import{v as Ae}from"./chunk-4N3BGJLH.js";import{$ as R,$a as Q,Aa as ye,Ab as K,Ac as Je,Ca as ve,Cc as $e,D as I,Dc as et,E as X,Ec as tt,F as re,Fc as nt,Gc as it,Hb as E,Hc as at,Ia as C,Ib as h,Ja as Ce,Jc as ot,K as se,Ka as De,Kc as rt,L as le,Lc as st,N as f,P as o,Pa as ke,Qa as l,Ra as m,Sa as W,T as b,Ta as q,U as M,Ua as xe,V as me,Wa as Se,Wb as Fe,X as P,Xa as we,Y as ce,Ya as u,Za as Ie,Zb as Be,_a as d,_b as Ne,a as j,aa as ue,ab as O,ac as Le,b as ne,bb as Pe,bc as He,c as x,cb as Re,da as de,db as D,dc as Ye,eb as k,f as S,gc as je,hc as Ve,ia as T,ic as Xe,j as V,ja as pe,jb as U,jc as ze,kb as Te,lb as p,lc as We,n as ie,na as y,oa as he,ob as Oe,oc as qe,pa as ge,pc as Qe,qc as Ue,ra as _e,rc as G,ta as fe,ua as be,v as w,vb as Ee,w as ae,wc as Z,xa as v,xc as Ke,ya as Me,yc as Ge,z as oe,za as z,zc as Ze}from"./chunk-VK4AMZDW.js";var A=class a{dialogRef=o(Ge);data=o(Ze);close(s){this.dialogRef.close(s)}static \u0275fac=function(e){return new(e||a)};static \u0275cmp=v({type:a,selectors:[["app-slot-occupied-dialog"]],hostAttrs:[1,"general-dialog"],decls:11,vars:2,consts:[["mat-dialog-title","",1,"general-dialog__title"],["align","end"],["mat-button","",1,"general-dialog__cancel",3,"click"],["mat-button","",1,"general-dialog__confirm",3,"click"],["mat-flat-button","",1,"general-dialog__confirm",3,"click"]],template:function(e,t){e&1&&(l(0,"h2",0),p(1,"Slot belegt"),m(),l(2,"mat-dialog-content"),p(3),m(),l(4,"mat-dialog-actions",1)(5,"button",2),u("click",function(){return t.close()}),p(6,"Abbrechen"),m(),l(7,"button",3),u("click",function(){return t.close("discardPile")}),p(8," In den Ablagestapel "),m(),l(9,"button",4),u("click",function(){return t.close("inventory")}),p(10," Ins Inventar "),m()()),e&2&&(y(3),Oe(" Wohin kommt \u201E",t.data.cardName,"\u201C von ",t.data.characterName,"? "))},dependencies:[nt,$e,tt,et,st,rt],encapsulation:2})};var ht=class a{dialog=o(Je);cardManager=o(ut);equipment=o(dt);characters=o(Ae).characters;assignDisabledReason=K(()=>this.characters().length===0?"Keine Charaktere in der Session":null);ownerNames=K(()=>new Map(this.characters().map(s=>[s.id,s.name])));async assignTo(s,e,t){if(mt(this.cardManager.state(),s)?.cardType!=="equipment"||this.assignDisabledReason()!==null)return;let i=ct(this.cardManager.assigned(),e,t),r=i&&!lt(i,s)?await this.chooseDisplaced(i.card.name,e):"discardPile";r&&this.equipment.assignCard(s,e,t,r)}inventoryTargets(s){let e=s.kind==="inventory"?s.characterId:null;return this.characters().filter(t=>t.id!==e)}chooseDisplaced(s,e){let t=this.ownerNames().get(e)??"Unbekannt";return ie(this.dialog.open(A,{data:{cardName:s,characterName:t}}).afterClosed())}static \u0275fac=function(e){return new(e||a)};static \u0275prov=se({token:a,factory:a.\u0275fac,providedIn:"root"})};var Ct=["mat-menu-item",""],Dt=[[["mat-icon"],["","matMenuItemIcon",""]],"*"],kt=["mat-icon, [matMenuItemIcon]","*"];function xt(a,s){a&1&&(me(),l(0,"svg",2),W(1,"polygon",3),m())}var St=["*"];function wt(a,s){if(a&1){let e=Se();q(0,"div",0),Ie("click",function(){b(e);let n=d();return M(n.closed.emit("click"))})("animationstart",function(n){b(e);let i=d();return M(i._onAnimationStart(n.animationName))})("animationend",function(n){b(e);let i=d();return M(i._onAnimationDone(n.animationName))})("animationcancel",function(n){b(e);let i=d();return M(i._onAnimationDone(n.animationName))}),q(1,"div",1),O(2),xe()()}if(a&2){let e=d();Te(e._classList),U("mat-menu-panel-animations-disabled",e._animationsDisabled)("mat-menu-panel-exit-animation",e._panelAnimationState==="void")("mat-menu-panel-animating",e._isAnimating()),we("id",e.panelId),C("aria-label",e.ariaLabel||null)("aria-labelledby",e.ariaLabelledby||null)("aria-describedby",e.ariaDescribedby||null)}}var ee=new f("MAT_MENU_PANEL"),$=(()=>{class a{_elementRef=o(T);_document=o(ce);_focusMonitor=o(G);_parentMenu=o(ee,{optional:!0});_changeDetectorRef=o(E);role="menuitem";disabled=!1;disableRipple=!1;_hovered=new S;_focused=new S;_highlighted=!1;_triggersSubmenu=!1;constructor(){o(Fe).load(at),this._parentMenu?.addItem?.(this)}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,t):this._getHostElement().focus(t),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),t=e.querySelectorAll("mat-icon, .material-icons");for(let n=0;n<t.length;n++)t[n].remove();return e.textContent?.trim()||""}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static \u0275fac=function(t){return new(t||a)};static \u0275cmp=v({type:a,selectors:[["","mat-menu-item",""]],hostAttrs:[1,"mat-mdc-menu-item","mat-focus-indicator"],hostVars:8,hostBindings:function(t,n){t&1&&u("click",function(r){return n._checkDisabled(r)})("mouseenter",function(){return n._handleMouseEnter()}),t&2&&(C("role",n.role)("tabindex",n._getTabIndex())("aria-disabled",n.disabled)("disabled",n.disabled||null),U("mat-mdc-menu-item-highlighted",n._highlighted)("mat-mdc-menu-item-submenu-trigger",n._triggersSubmenu))},inputs:{role:"role",disabled:[2,"disabled","disabled",h],disableRipple:[2,"disableRipple","disableRipple",h]},exportAs:["matMenuItem"],attrs:Ct,ngContentSelectors:kt,decls:5,vars:3,consts:[[1,"mat-mdc-menu-item-text"],["matRipple","",1,"mat-mdc-menu-ripple",3,"matRippleDisabled","matRippleTrigger"],["viewBox","0 0 5 10","focusable","false","aria-hidden","true",1,"mat-mdc-menu-submenu-icon"],["points","0,0 5,5 0,10"]],template:function(t,n){t&1&&(Q(Dt),O(0),l(1,"span",0),O(2,1),m(),W(3,"div",1),Ce(4,xt,2,0,":svg:svg",2)),t&2&&(y(3),ke("matRippleDisabled",n.disableRipple||n.disabled)("matRippleTrigger",n._getHostElement()),y(),De(n._triggersSubmenu?4:-1))},dependencies:[it],encapsulation:2,changeDetection:0})}return a})();var It=new f("MatMenuContent");var Pt=new f("mat-menu-default-options",{providedIn:"root",factory:()=>({overlapTrigger:!1,xPosition:"after",yPosition:"below",backdropClass:"cdk-overlay-transparent-backdrop"})}),J="_mat-menu-enter",F="_mat-menu-exit",B=(()=>{class a{_elementRef=o(T);_changeDetectorRef=o(E);_injector=o(P);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=Z();_allItems;_directDescendantItems=new pe;_classList={};_panelAnimationState="void";_animationDone=new S;_isAnimating=de(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;set panelClass(e){let t=this._previousPanelClass,n=j({},this._classList);t&&t.length&&t.split(" ").forEach(i=>{n[i]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(" ").forEach(i=>{n[i]=!0}),this._elementRef.nativeElement.className=""),this._classList=n}_previousPanelClass;get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new R;close=this.closed;panelId=o(He).getId("mat-menu-panel-");constructor(){let e=o(Pt);this.overlayPanelClass=e.overlayPanelClass||"",this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Ke(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit("tab")),this._directDescendantItems.changes.pipe(I(this._directDescendantItems),X(e=>w(...e.map(t=>t._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let t=this._keyManager;if(this._panelAnimationState==="enter"&&t.activeItem?._hasFocus()){let n=e.toArray(),i=Math.max(0,Math.min(n.length-1,t.activeItemIndex||0));n[i]&&!n[i].disabled?t.setActiveItem(i):t.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(I(this._directDescendantItems),X(t=>w(...t.map(n=>n._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let t=e.keyCode,n=this._keyManager;switch(t){case 27:je(e)||(e.preventDefault(),this.closed.emit("keydown"));break;case 37:this.parentMenu&&this.direction==="ltr"&&this.closed.emit("keydown");break;case 39:this.parentMenu&&this.direction==="rtl"&&this.closed.emit("keydown");break;default:(t===38||t===40)&&n.setFocusOrigin("keyboard"),n.onKeydown(e);return}}focusFirstItem(e="program"){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=he(()=>{let t=this._resolvePanel();if(!t||!t.contains(document.activeElement)){let n=this._keyManager;n.setFocusOrigin(e).setFirstItemActive(),!n.activeItem&&t&&t.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,t=this.yPosition){this._classList=ne(j({},this._classList),{"mat-menu-before":e==="before","mat-menu-after":e==="after","mat-menu-above":t==="above","mat-menu-below":t==="below"}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let t=e===F;(t||e===J)&&(t&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(t?"void":"enter"),this._isAnimating.set(!1))}_onAnimationStart(e){(e===J||e===F)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?"enter":"void",e){if(this._keyManager.activeItemIndex===0){let t=this._resolvePanel();t&&(t.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(F),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?J:F)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(I(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(t=>t._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest('[role="menu"]')),e}static \u0275fac=function(t){return new(t||a)};static \u0275cmp=v({type:a,selectors:[["mat-menu"]],contentQueries:function(t,n,i){if(t&1&&Pe(i,It,5)(i,$,5)(i,$,4),t&2){let r;D(r=k())&&(n.lazyContent=r.first),D(r=k())&&(n._allItems=r),D(r=k())&&(n.items=r)}},viewQuery:function(t,n){if(t&1&&Re(ge,5),t&2){let i;D(i=k())&&(n.templateRef=i.first)}},hostVars:3,hostBindings:function(t,n){t&2&&C("aria-label",null)("aria-labelledby",null)("aria-describedby",null)},inputs:{backdropClass:"backdropClass",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],xPosition:"xPosition",yPosition:"yPosition",overlapTrigger:[2,"overlapTrigger","overlapTrigger",h],hasBackdrop:[2,"hasBackdrop","hasBackdrop",e=>e==null?null:h(e)],panelClass:[0,"class","panelClass"],classList:"classList"},outputs:{closed:"closed",close:"close"},exportAs:["matMenu"],features:[Ee([{provide:ee,useExisting:a}])],ngContentSelectors:St,decls:1,vars:0,consts:[["tabindex","-1","role","menu",1,"mat-mdc-menu-panel",3,"click","animationstart","animationend","animationcancel","id"],[1,"mat-mdc-menu-content"]],template:function(t,n){t&1&&(Q(),ve(0,wt,3,12,"ng-template"))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--mat-menu-item-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-menu-item-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-menu-item-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-menu-item-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-menu-item-label-text-weight, var(--mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--mat-menu-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-menu-container-color, var(--mat-sys-surface-container));
  box-shadow: var(--mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--mat-menu-divider-color, var(--mat-sys-surface-variant));
  margin-bottom: var(--mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--mat-menu-item-leading-spacing, 12px);
  padding-right: var(--mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--mat-menu-item-label-text-color, var(--mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--mat-menu-item-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled] {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--mat-menu-item-spacing, 12px);
  height: var(--mat-menu-item-icon-size, 24px);
  width: var(--mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2,changeDetection:0})}return a})(),Rt=new f("mat-menu-scroll-strategy",{providedIn:"root",factory:()=>{let a=o(P);return()=>Ve(a)}});var g=new WeakMap,Tt=(()=>{class a{_canHaveBackdrop;_element=o(T);_viewContainerRef=o(be);_menuItemInstance=o($,{optional:!0,self:!0});_dir=o(Be,{optional:!0});_focusMonitor=o(G);_ngZone=o(ue);_injector=o(P);_scrollStrategy=o(Rt);_changeDetectorRef=o(E);_animationsDisabled=Z();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=x.EMPTY;_menuCloseSubscription=x.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e&&(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(t=>{this._destroyMenu(t),(t==="click"||t==="tab")&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(t)})),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let t=o(ee,{optional:!0});this._parentMaterialMenu=t instanceof B?t:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&g.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let t=this._menu;if(this._menuOpen||!t)return;this._pendingRemoval?.unsubscribe();let n=g.get(t);g.set(t,this),n&&n!==this&&n._closeMenu();let i=this._createOverlay(t),r=i.getConfig(),c=r.positionStrategy;this._setPosition(t,c),this._canHaveBackdrop?r.hasBackdrop=t.hasBackdrop==null?!this._triggersSubmenu():t.hasBackdrop:r.hasBackdrop=t.hasBackdrop??!1,i.hasAttached()||(i.attach(this._getPortal(t)),t.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),t.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,t.direction=this.dir,e&&t.focusFirstItem(this._openedBy||"program"),this._setIsMenuOpen(!0),t instanceof B&&(t._setIsOpen(!0),t._directDescendantItems.changes.pipe(re(t.close)).subscribe(()=>{c.withLockedPosition(!1).reapplyLastPosition(),c.withLockedPosition(!0)}))}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}_destroyMenu(e){let t=this._overlayRef,n=this._menu;!t||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),n instanceof B&&this._ownsMenu(n)?(this._pendingRemoval=n._animationDone.pipe(oe(1)).subscribe(()=>{t.detach(),g.has(n)||n.lazyContent?.detach()}),n._setIsOpen(!1)):(t.detach(),n?.lazyContent?.detach()),n&&this._ownsMenu(n)&&g.delete(n),this.restoreFocus&&(e==="keydown"||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let t=this._getOverlayConfig(e);this._subscribeToPositions(e,t.positionStrategy),this._overlayRef=We(this._injector,t),this._overlayRef.keydownEvents().subscribe(n=>{this._menu instanceof B&&this._menu._handleKeydown(n)})}return this._overlayRef}_getOverlayConfig(e){return new Xe({positionStrategy:ze(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),backdropClass:e.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||"ltr",disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,t){e.setPositionClasses&&t.positionChanges.subscribe(n=>{this._ngZone.run(()=>{let i=n.connectionPair.overlayX==="start"?"after":"before",r=n.connectionPair.overlayY==="top"?"below":"above";e.setPositionClasses(i,r)})})}_setPosition(e,t){let[n,i]=e.xPosition==="before"?["end","start"]:["start","end"],[r,c]=e.yPosition==="above"?["bottom","top"]:["top","bottom"],[N,L]=[r,c],[H,Y]=[n,i],_=0;if(this._triggersSubmenu()){if(Y=n=e.xPosition==="before"?"start":"end",i=H=n==="end"?"start":"end",this._parentMaterialMenu){if(this._parentInnerPadding==null){let te=this._parentMaterialMenu.items.first;this._parentInnerPadding=te?te._getHostElement().offsetTop:0}_=r==="bottom"?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(N=r==="top"?"bottom":"top",L=c==="top"?"bottom":"top");t.withPositions([{originX:n,originY:N,overlayX:H,overlayY:r,offsetY:_},{originX:i,originY:N,overlayX:Y,overlayY:r,offsetY:_},{originX:n,originY:L,overlayX:H,overlayY:c,offsetY:-_},{originX:i,originY:L,overlayX:Y,overlayY:c,offsetY:-_}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),t=this._overlayRef.detachments(),n=this._parentMaterialMenu?this._parentMaterialMenu.closed:V(),i=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(ae(r=>this._menuOpen&&r!==this._menuItemInstance)):V();return w(e,n,i,t)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new Ye(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return g.get(e)===this}_triggerIsAriaDisabled(){return h(this._element.nativeElement.getAttribute("aria-disabled"))}static \u0275fac=function(t){fe()};static \u0275dir=z({type:a})}return a})(),Pn=(()=>{class a extends Tt{_cleanupTouchstart;_hoverSubscription=x.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new R;onMenuOpen=this.menuOpened;menuClosed=new R;onMenuClose=this.menuClosed;constructor(){super(!0);let e=o(_e);this._cleanupTouchstart=e.listen(this._element.nativeElement,"touchstart",t=>{Ue(t)||(this._openedBy="touch")},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){Qe(e)||(this._openedBy=e.button===0?"mouse":void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let t=e.keyCode;(t===13||t===32)&&(this._openedBy="keyboard"),this.triggersSubmenu()&&(t===39&&this.dir==="ltr"||t===37&&this.dir==="rtl")&&(this._openedBy="keyboard",this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!=="void"&&(this._openedBy="mouse",this._openMenu(!1))}))}static \u0275fac=function(t){return new(t||a)};static \u0275dir=z({type:a,selectors:[["","mat-menu-trigger-for",""],["","matMenuTriggerFor",""]],hostAttrs:[1,"mat-mdc-menu-trigger"],hostVars:3,hostBindings:function(t,n){t&1&&u("click",function(r){return n._handleClick(r)})("mousedown",function(r){return n._handleMousedown(r)})("keydown",function(r){return n._handleKeydown(r)}),t&2&&C("aria-haspopup",n.menu?"menu":null)("aria-expanded",n.menuOpen)("aria-controls",n.menuOpen?n.menu==null?null:n.menu.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,"mat-menu-trigger-for","_deprecatedMatMenuTriggerFor"],menu:[0,"matMenuTriggerFor","menu"],menuData:[0,"matMenuTriggerData","menuData"],restoreFocus:[0,"matMenuTriggerRestoreFocus","restoreFocus"]},outputs:{menuOpened:"menuOpened",onMenuOpen:"onMenuOpen",menuClosed:"menuClosed",onMenuClose:"onMenuClose"},exportAs:["matMenuTrigger"],features:[ye]})}return a})();var Rn=(()=>{class a{static \u0275fac=function(t){return new(t||a)};static \u0275mod=Me({type:a});static \u0275inj=le({imports:[ot,qe,Ne,Le]})}return a})();export{$ as a,B as b,Pn as c,Rn as d,ht as e};
