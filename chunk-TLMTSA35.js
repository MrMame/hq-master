import{b as li,d as ci}from"./chunk-SPSFXE6H.js";import{a as un}from"./chunk-SXAY45BS.js";import{$ as v,Ab as ai,B as Qn,C as nt,Ca as Z,D as tn,Da as Lt,Ea as z,Fa as L,Ga as E,H as me,Ha as ge,I as st,Ia as nn,Ib as U,K as Nt,La as k,Lb as et,M as fe,Ma as w,Mb as zt,Na as m,O as $,Oa as ni,P as h,Pa as D,Q as b,Qa as _e,S as g,Sa as ii,Sb as wt,U as s,Va as lt,Vb as W,Wa as H,Wb as si,X as vt,Yb as ve,a as f,aa as x,ab as oi,b as V,ba as en,bb as ct,c as ce,cb as dt,da as T,e as de,ea as y,eb as on,f as _,fb as rn,g as Yn,gb as Bt,h as Qe,ia as X,ib as an,j as $n,jb as K,k as ue,la as it,ma as P,mb as be,nb as Ct,oa as C,p as Pt,pb as sn,q as Xn,qa as Jn,qb as ln,rb as cn,sa as ti,t as Zn,ta as pe,u as he,ua as ei,v as Kn,w as qn,wb as B,x as tt,xb as ri,y as Je,ya as yt,yb as jt,zb as dn}from"./chunk-COUUXKUS.js";var hn;try{hn=typeof Intl<"u"&&Intl.v8BreakIterator}catch{hn=!1}var M=(()=>{class n{_platformId=s(ti);isBrowser=this._platformId?ci(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||hn)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var mn;function di(){if(mn==null){let n=typeof document<"u"?document.head:null;mn=!!(n&&(n.createShadowRoot||n.attachShadow))}return mn}function fn(n){if(di()){let e=n.getRootNode?n.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&e instanceof ShadowRoot)return e}return null}function Ht(){let n=typeof document<"u"&&document?document.activeElement:null;for(;n&&n.shadowRoot;){let e=n.shadowRoot.activeElement;if(e===n)break;n=e}return n}function N(n){return n.composedPath?n.composedPath()[0]:n.target}function pn(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var ye=new WeakMap,q=(()=>{class n{_appRef;_injector=s(v);_environmentInjector=s(vt);load(t){let i=this._appRef=this._appRef||this._injector.get(lt),o=ye.get(i);o||(o={loaders:new Set,refs:[]},ye.set(i,o),i.onDestroy(()=>{ye.get(i)?.refs.forEach(r=>r.destroy()),ye.delete(i)})),o.loaders.has(t)||(o.loaders.add(t),o.refs.push(ve(t,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function S(n){return n==null?"":typeof n=="string"?n:`${n}px`}function Dt(n){return Array.isArray(n)?n:[n]}function Ut(n,e=0){return ui(n)?Number(n):arguments.length===2?e:0}function ui(n){return!isNaN(parseFloat(n))&&!isNaN(Number(n))}function Q(n){return n instanceof C?n.nativeElement:n}var qo=new g("cdk-dir-doc",{providedIn:"root",factory:()=>s(x)}),Qo=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function Jo(n){let e=n?.toLowerCase()||"";return e==="auto"&&typeof navigator<"u"&&navigator?.language?Qo.test(navigator.language)?"rtl":"ltr":e==="rtl"?"rtl":"ltr"}var ut=(()=>{class n{get value(){return this.valueSignal()}valueSignal=X("ltr");change=new T;constructor(){let t=s(qo,{optional:!0});if(t){let i=t.body?t.body.dir:null,o=t.documentElement?t.documentElement.dir:null;this.valueSignal.set(Jo(i||o||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var G=(function(n){return n[n.NORMAL=0]="NORMAL",n[n.NEGATED=1]="NEGATED",n[n.INVERTED=2]="INVERTED",n})(G||{}),Ce,ht;function we(){if(ht==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return ht=!1,ht;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)ht=!0;else{let n=Element.prototype.scrollTo;n?ht=!/\{\s*\[native code\]\s*\}/.test(n.toString()):ht=!1}}return ht}function Et(){if(typeof document!="object"||!document)return G.NORMAL;if(Ce==null){let n=document.createElement("div"),e=n.style;n.dir="rtl",e.width="1px",e.overflow="auto",e.visibility="hidden",e.pointerEvents="none",e.position="absolute";let t=document.createElement("div"),i=t.style;i.width="2px",i.height="1px",n.appendChild(t),document.body.appendChild(n),Ce=G.NORMAL,n.scrollLeft===0&&(n.scrollLeft=1,Ce=n.scrollLeft===0?G.NEGATED:G.INVERTED),n.remove()}return Ce}var Y=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({})}return n})();var tr=20,De=(()=>{class n{_ngZone=s(y);_platform=s(M);_renderer=s(z).createRenderer(null,null);_cleanupGlobalListener;constructor(){}_scrolled=new _;_scrolledCount=0;scrollContainers=new Map;register(t){this.scrollContainers.has(t)||this.scrollContainers.set(t,t.elementScrolled().subscribe(()=>this._scrolled.next(t)))}deregister(t){let i=this.scrollContainers.get(t);i&&(i.unsubscribe(),this.scrollContainers.delete(t))}scrolled(t=tr){return this._platform.isBrowser?new de(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let o=t>0?this._scrolled.pipe(Je(t)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{o.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):ue()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((t,i)=>this.deregister(i)),this._scrolled.complete()}ancestorScrolled(t,i){let o=this.getAncestorScrollContainers(t);return this.scrolled(i).pipe(tt(r=>!r||o.indexOf(r)>-1))}getAncestorScrollContainers(t){let i=[];return this.scrollContainers.forEach((o,r)=>{this._scrollableContainsElement(r,t)&&i.push(r)}),i}_scrollableContainsElement(t,i){let o=Q(i),r=t.getElementRef().nativeElement;do if(o==r)return!0;while(o=o.parentElement);return!1}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),mi=(()=>{class n{elementRef=s(C);scrollDispatcher=s(De);ngZone=s(y);dir=s(ut,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new _;_renderer=s(L);_cleanupScroll;_elementScrolled=new _;constructor(){}ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,"scroll",t=>this._elementScrolled.next(t))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(t){let i=this.elementRef.nativeElement,o=this.dir&&this.dir.value=="rtl";t.left==null&&(t.left=o?t.end:t.start),t.right==null&&(t.right=o?t.start:t.end),t.bottom!=null&&(t.top=i.scrollHeight-i.clientHeight-t.bottom),o&&Et()!=G.NORMAL?(t.left!=null&&(t.right=i.scrollWidth-i.clientWidth-t.left),Et()==G.INVERTED?t.left=t.right:Et()==G.NEGATED&&(t.left=t.right?-t.right:t.right)):t.right!=null&&(t.left=i.scrollWidth-i.clientWidth-t.right),this._applyScrollToOptions(t)}_applyScrollToOptions(t){let i=this.elementRef.nativeElement;we()?i.scrollTo(t):(t.top!=null&&(i.scrollTop=t.top),t.left!=null&&(i.scrollLeft=t.left))}measureScrollOffset(t){let i="left",o="right",r=this.elementRef.nativeElement;if(t=="top")return r.scrollTop;if(t=="bottom")return r.scrollHeight-r.clientHeight-r.scrollTop;let a=this.dir&&this.dir.value=="rtl";return t=="start"?t=a?o:i:t=="end"&&(t=a?i:o),a&&Et()==G.INVERTED?t==i?r.scrollWidth-r.clientWidth-r.scrollLeft:r.scrollLeft:a&&Et()==G.NEGATED?t==i?r.scrollLeft+r.scrollWidth-r.clientWidth:-r.scrollLeft:t==i?r.scrollLeft:r.scrollWidth-r.clientWidth-r.scrollLeft}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,selectors:[["","cdk-scrollable",""],["","cdkScrollable",""]]})}return n})(),er=20,Wt=(()=>{class n{_platform=s(M);_listeners;_viewportSize=null;_change=new _;_document=s(x);constructor(){let t=s(y),i=s(z).createRenderer(null,null);t.runOutsideAngular(()=>{if(this._platform.isBrowser){let o=r=>this._change.next(r);this._listeners=[i.listen("window","resize",o),i.listen("window","orientationchange",o)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(t=>t()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let t={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),t}getViewportRect(){let t=this.getViewportScrollPosition(),{width:i,height:o}=this.getViewportSize();return{top:t.top,left:t.left,bottom:t.top+o,right:t.left+i,height:o,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let t=this._document,i=this._getWindow(),o=t.documentElement,r=o.getBoundingClientRect(),a=-r.top||t.body?.scrollTop||i.scrollY||o.scrollTop||0,l=-r.left||t.body?.scrollLeft||i.scrollX||o.scrollLeft||0;return{top:a,left:l}}change(t=er){return t>0?this._change.pipe(Je(t)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let t=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:t.innerWidth,height:t.innerHeight}:{width:0,height:0}}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var hi=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({})}return n})(),gn=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({imports:[Y,hi,Y,hi]})}return n})();var _n={},J=class n{_appId=s(Jn);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(e,t=!1){return this._appId!=="ng"&&(e+=this._appId),_n.hasOwnProperty(e)||(_n[e]=0),`${e}${t?n._infix+"-":""}${_n[e]++}`}static \u0275fac=function(t){return new(t||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})};var Gt=class{_attachedHost=null;attach(e){return this._attachedHost=e,e.attach(this)}detach(){let e=this._attachedHost;e!=null&&(this._attachedHost=null,e.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(e){this._attachedHost=e}},xt=class extends Gt{component;viewContainerRef;injector;projectableNodes;bindings;constructor(e,t,i,o,r){super(),this.component=e,this.viewContainerRef=t,this.injector=i,this.projectableNodes=o,this.bindings=r||null}},At=class extends Gt{templateRef;viewContainerRef;context;injector;constructor(e,t,i,o){super(),this.templateRef=e,this.viewContainerRef=t,this.context=i,this.injector=o}get origin(){return this.templateRef.elementRef}attach(e,t=this.context){return this.context=t,super.attach(e)}detach(){return this.context=void 0,super.detach()}},bn=class extends Gt{element;constructor(e){super(),this.element=e instanceof C?e.nativeElement:e}},Mt=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(e){if(e instanceof xt)return this._attachedPortal=e,this.attachComponentPortal(e);if(e instanceof At)return this._attachedPortal=e,this.attachTemplatePortal(e);if(this.attachDomPortal&&e instanceof bn)return this._attachedPortal=e,this.attachDomPortal(e)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(e){this._disposeFn=e}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},Ee=class extends Mt{outletElement;_appRef;_defaultInjector;constructor(e,t,i){super(),this.outletElement=e,this._appRef=t,this._defaultInjector=i}attachComponentPortal(e){let t;if(e.viewContainerRef){let i=e.injector||e.viewContainerRef.injector,o=i.get(nn,null,{optional:!0})||void 0;t=e.viewContainerRef.createComponent(e.component,{index:e.viewContainerRef.length,injector:i,ngModuleRef:o,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),this.setDisposeFn(()=>t.destroy())}else{let i=this._appRef,o=e.injector||this._defaultInjector||v.NULL,r=o.get(vt,i.injector);t=ve(e.component,{elementInjector:o,environmentInjector:r,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),i.attachView(t.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(t.hostView),t.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(t)),this._attachedPortal=e,t}attachTemplatePortal(e){let t=e.viewContainerRef,i=t.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return i.rootNodes.forEach(o=>this.outletElement.appendChild(o)),i.detectChanges(),this.setDisposeFn(()=>{let o=t.indexOf(i);o!==-1&&t.remove(o)}),this._attachedPortal=e,i}attachDomPortal=e=>{let t=e.element;t.parentNode;let i=this.outletElement.ownerDocument.createComment("dom-portal");t.parentNode.insertBefore(i,t),this.outletElement.appendChild(t),this._attachedPortal=e,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(t,i)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(e){return e.hostView.rootNodes[0]}};var Yt=(()=>{class n extends Mt{_moduleRef=s(nn,{optional:!0});_document=s(x);_viewContainerRef=s(ge);_isInitialized=!1;_attachedRef=null;constructor(){super()}get portal(){return this._attachedPortal}set portal(t){this.hasAttached()&&!t&&!this._isInitialized||(this.hasAttached()&&super.detach(),t&&super.attach(t),this._attachedPortal=t||null)}attached=new T;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(t){t.setAttachedHost(this);let i=t.viewContainerRef!=null?t.viewContainerRef:this._viewContainerRef,o=i.createComponent(t.component,{index:i.length,injector:t.injector||i.injector,projectableNodes:t.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:t.bindings||void 0});return i!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=t,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(t){t.setAttachedHost(this);let i=this._viewContainerRef.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=t,this._attachedRef=i,this.attached.emit(i),i}attachDomPortal=t=>{let i=t.element;i.parentNode;let o=this._document.createComment("dom-portal");t.setAttachedHost(this),i.parentNode.insertBefore(o,i),this._getRootNode().appendChild(i),this._attachedPortal=t,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(i,o)})};_getRootNode(){let t=this._viewContainerRef.element.nativeElement;return t.nodeType===t.ELEMENT_NODE?t:t.parentNode}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[D]})}return n})(),mt=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({})}return n})();function xe(n,...e){return e.length?e.some(t=>n[t]):n.altKey||n.shiftKey||n.ctrlKey||n.metaKey}var fi=we();function kt(n){return new Ae(n.get(Wt),n.get(x))}var Ae=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(e,t){this._viewportRuler=e,this._document=t}attach(){}enable(){if(this._canBeEnabled()){let e=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=e.style.left||"",this._previousHTMLStyles.top=e.style.top||"",e.style.left=S(-this._previousScrollPosition.left),e.style.top=S(-this._previousScrollPosition.top),e.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let e=this._document.documentElement,t=this._document.body,i=e.style,o=t.style,r=i.scrollBehavior||"",a=o.scrollBehavior||"";this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,e.classList.remove("cdk-global-scrollblock"),fi&&(i.scrollBehavior=o.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),fi&&(i.scrollBehavior=r,o.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let t=this._document.documentElement,i=this._viewportRuler.getViewportSize();return t.scrollHeight>i.height||t.scrollWidth>i.width}};function Ci(n,e){return new Me(n.get(De),n.get(y),n.get(Wt),e)}var Me=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(e,t,i,o){this._scrollDispatcher=e,this._ngZone=t,this._viewportRuler=i,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(this._scrollSubscription)return;let e=this._scrollDispatcher.scrolled(0).pipe(tt(t=>!t||!this._overlayRef.overlayElement.contains(t.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=e.subscribe(()=>{let t=this._viewportRuler.getViewportScrollPosition().top;Math.abs(t-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=e.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var $t=class{enable(){}disable(){}attach(){}};function vn(n,e){return e.some(t=>{let i=n.bottom<t.top,o=n.top>t.bottom,r=n.right<t.left,a=n.left>t.right;return i||o||r||a})}function pi(n,e){return e.some(t=>{let i=n.top<t.top,o=n.bottom>t.bottom,r=n.left<t.left,a=n.right>t.right;return i||o||r||a})}function wi(n,e){return new Se(n.get(De),n.get(Wt),n.get(y),e)}var Se=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(e,t,i,o){this._scrollDispatcher=e,this._viewportRuler=t,this._ngZone=i,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(!this._scrollSubscription){let e=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(e).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let t=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:o}=this._viewportRuler.getViewportSize();vn(t,[{width:i,height:o,bottom:o,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},Di=(()=>{class n{_injector=s(v);constructor(){}noop=()=>new $t;close=t=>Ci(this._injector,t);block=()=>kt(this._injector);reposition=t=>wi(this._injector,t);static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),St=class{positionStrategy;scrollStrategy=new $t;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(e){if(e){let t=Object.keys(e);for(let i of t)e[i]!==void 0&&(this[i]=e[i])}}};var Oe=class{connectionPair;scrollableViewProperties;constructor(e,t){this.connectionPair=e,this.scrollableViewProperties=t}};var Ei=(()=>{class n{_attachedOverlays=[];_document=s(x);_isAttached=!1;constructor(){}ngOnDestroy(){this.detach()}add(t){this.remove(t),this._attachedOverlays.push(t)}remove(t){let i=this._attachedOverlays.indexOf(t);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(t,i,o){return o.observers.length<1?!1:t.eventPredicate?t.eventPredicate(i):!0}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),xi=(()=>{class n extends Ei{_ngZone=s(y);_renderer=s(z).createRenderer(null,null);_cleanupKeydown;add(t){super.add(t),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=t=>{let i=this._attachedOverlays;for(let o=i.length-1;o>-1;o--){let r=i[o];if(this.canReceiveEvent(r,t,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(t));break}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),Ai=(()=>{class n extends Ei{_platform=s(M);_ngZone=s(y);_renderer=s(z).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(t){if(super.add(t),!this._isAttached){let i=this._document.body,o={capture:!0},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(i,"pointerdown",this._pointerDownListener,o),r.listen(i,"click",this._clickListener,o),r.listen(i,"auxclick",this._clickListener,o),r.listen(i,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(t=>t()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=t=>{this._pointerDownEventTarget=N(t)};_clickListener=t=>{let i=N(t),o=t.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let a=r.length-1;a>-1;a--){let l=r[a],c=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,t,c))){if(gi(l.overlayElement,i)||gi(l.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>c.next(t)):c.next(t)}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function gi(n,e){let t=typeof ShadowRoot<"u"&&ShadowRoot,i=e;for(;i;){if(i===n)return!0;i=t&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var Mi=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(i,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2,changeDetection:0})}return n})(),Ie=(()=>{class n{_platform=s(M);_containerElement;_document=s(x);_styleLoader=s(q);constructor(){}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let t="cdk-overlay-container";if(this._platform.isBrowser||pn()){let o=this._document.querySelectorAll(`.${t}[platform="server"], .${t}[platform="test"]`);for(let r=0;r<o.length;r++)o[r].remove()}let i=this._document.createElement("div");i.classList.add(t),pn()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i}_loadStyles(){this._styleLoader.load(Mi)}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),yn=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(e,t,i,o){this._renderer=t,this._ngZone=i,this.element=e.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=t.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let e=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),e.style.pointerEvents="none",e.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function Cn(n){return n&&n.nodeType===1}var Ot=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new _;_attachments=new _;_detachments=new _;_positionStrategy;_scrollStrategy;_locationChanges=ce.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new _;_outsidePointerEvents=new _;_afterNextRenderRef;constructor(e,t,i,o,r,a,l,c,u,d=!1,p,I){this._portalOutlet=e,this._host=t,this._pane=i,this._config=o,this._ngZone=r,this._keyboardDispatcher=a,this._document=l,this._location=c,this._outsideClickDispatcher=u,this._animationsDisabled=d,this._injector=p,this._renderer=I,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(e){if(this._disposed)return null;this._attachHost();let t=this._portalOutlet.attach(e);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=Z(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof t?.onDestroy=="function"&&t.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),t}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let e=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),e}dispose(){if(this._disposed)return;let e=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,e&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(e){e!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=e,this.hasAttached()&&(e.attach(this),this.updatePosition()))}updateSize(e){this._config=f(f({},this._config),e),this._updateElementSize()}setDirection(e){this._config=V(f({},this._config),{direction:e}),this._updateElementDirection()}addPanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!0)}removePanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!1)}getDirection(){let e=this._config.direction;return e?typeof e=="string"?e:e.value:"ltr"}updateScrollStrategy(e){e!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=e,this.hasAttached()&&(e.attach(this),e.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let e=this._pane.style;e.width=S(this._config.width),e.height=S(this._config.height),e.minWidth=S(this._config.minWidth),e.minHeight=S(this._config.minHeight),e.maxWidth=S(this._config.maxWidth),e.maxHeight=S(this._config.maxHeight)}_togglePointerEvents(e){this._pane.style.pointerEvents=e?"":"none"}_attachHost(){if(!this._host.parentElement){let e=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Cn(e)?e.after(this._host):e?.type==="parent"?e.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let e="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new yn(this._document,this._renderer,this._ngZone,t=>{this._backdropClick.next(t)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(e))}):this._backdropRef.element.classList.add(e)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(e,t,i){let o=Dt(t||[]).filter(r=>!!r);o.length&&(i?e.classList.add(...o):e.classList.remove(...o))}_detachContentWhenEmpty(){let e=!1;try{this._detachContentAfterRenderRef=Z(()=>{e=!0,this._detachContent()},{injector:this._injector})}catch(t){if(e)throw t;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let e=this._scrollStrategy;e?.disable(),e?.detach?.()}},_i="cdk-overlay-connected-position-bounding-box",ir=/([A-Za-z%]+)$/;function Si(n,e){return new ke(e,n.get(Wt),n.get(x),n.get(M),n.get(Ie))}var ke=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new _;_resizeSubscription=ce.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(e,t,i,o,r){this._viewportRuler=t,this._document=i,this._platform=o,this._overlayContainer=r,this.setOrigin(e)}attach(e){this._overlayRef&&this._overlayRef,this._validatePositions(),e.hostElement.classList.add(_i),this._overlayRef=e,this._boundingBox=e.hostElement,this._pane=e.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let e=this._originRect,t=this._overlayRect,i=this._viewportRect,o=this._containerRect,r=[],a;for(let l of this._preferredPositions){let c=this._getOriginPoint(e,o,l),u=this._getOverlayPoint(c,t,l),d=this._getOverlayFit(u,t,i,l);if(d.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(l,c);return}if(this._canFitWithFlexibleDimensions(d,u,i)){r.push({position:l,origin:c,overlayRect:t,boundingBoxRect:this._calculateBoundingBoxRect(c,l)});continue}(!a||a.overlayFit.visibleArea<d.visibleArea)&&(a={overlayFit:d,overlayPoint:u,originPoint:c,position:l,overlayRect:t})}if(r.length){let l=null,c=-1;for(let u of r){let d=u.boundingBoxRect.width*u.boundingBoxRect.height*(u.position.weight||1);d>c&&(c=d,l=u)}this._isPushed=!1,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&ft(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(_i),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let e=this._lastPosition;e?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(e,this._getOriginPoint(this._originRect,this._containerRect,e))):this.apply()}withScrollableContainers(e){return this._scrollables=e,this}withPositions(e){return this._preferredPositions=e,e.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(e){return this._viewportMargin=e,this}withFlexibleDimensions(e=!0){return this._hasFlexibleDimensions=e,this}withGrowAfterOpen(e=!0){return this._growAfterOpen=e,this}withPush(e=!0){return this._canPush=e,this}withLockedPosition(e=!0){return this._positionLocked=e,this}setOrigin(e){return this._origin=e,this}withDefaultOffsetX(e){return this._offsetX=e,this}withDefaultOffsetY(e){return this._offsetY=e,this}withTransformOriginOn(e){return this._transformOriginSelector=e,this}withPopoverLocation(e){return this._popoverLocation=e,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof C?this._origin.nativeElement:Cn(this._origin)?this._origin:null}_getOriginPoint(e,t,i){let o;if(i.originX=="center")o=e.left+e.width/2;else{let a=this._isRtl()?e.right:e.left,l=this._isRtl()?e.left:e.right;o=i.originX=="start"?a:l}t.left<0&&(o-=t.left);let r;return i.originY=="center"?r=e.top+e.height/2:r=i.originY=="top"?e.top:e.bottom,t.top<0&&(r-=t.top),{x:o,y:r}}_getOverlayPoint(e,t,i){let o;i.overlayX=="center"?o=-t.width/2:i.overlayX==="start"?o=this._isRtl()?-t.width:0:o=this._isRtl()?0:-t.width;let r;return i.overlayY=="center"?r=-t.height/2:r=i.overlayY=="top"?0:-t.height,{x:e.x+o,y:e.y+r}}_getOverlayFit(e,t,i,o){let r=vi(t),{x:a,y:l}=e,c=this._getOffset(o,"x"),u=this._getOffset(o,"y");c&&(a+=c),u&&(l+=u);let d=0-a,p=a+r.width-i.width,I=0-l,F=l+r.height-i.height,R=this._subtractOverflows(r.width,d,p),O=this._subtractOverflows(r.height,I,F),at=R*O;return{visibleArea:at,isCompletelyWithinViewport:r.width*r.height===at,fitsInViewportVertically:O===r.height,fitsInViewportHorizontally:R==r.width}}_canFitWithFlexibleDimensions(e,t,i){if(this._hasFlexibleDimensions){let o=i.bottom-t.y,r=i.right-t.x,a=bi(this._overlayRef.getConfig().minHeight),l=bi(this._overlayRef.getConfig().minWidth),c=e.fitsInViewportVertically||a!=null&&a<=o,u=e.fitsInViewportHorizontally||l!=null&&l<=r;return c&&u}return!1}_pushOverlayOnScreen(e,t,i){if(this._previousPushAmount&&this._positionLocked)return{x:e.x+this._previousPushAmount.x,y:e.y+this._previousPushAmount.y};let o=vi(t),r=this._viewportRect,a=Math.max(e.x+o.width-r.width,0),l=Math.max(e.y+o.height-r.height,0),c=Math.max(r.top-i.top-e.y,0),u=Math.max(r.left-i.left-e.x,0),d=0,p=0;return o.width<=r.width?d=u||-a:d=e.x<this._getViewportMarginStart()?r.left-i.left-e.x:0,o.height<=r.height?p=c||-l:p=e.y<this._getViewportMarginTop()?r.top-i.top-e.y:0,this._previousPushAmount={x:d,y:p},{x:e.x+d,y:e.y+p}}_applyPosition(e,t){if(this._setTransformOrigin(e),this._setOverlayElementStyles(t,e),this._setBoundingBoxStyles(t,e),e.panelClass&&this._addPanelClasses(e.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(e!==this._lastPosition||!this._lastScrollVisibility||!or(this._lastScrollVisibility,i)){let o=new Oe(e,i);this._positionChanges.next(o)}this._lastScrollVisibility=i}this._lastPosition=e,this._isInitialRender=!1}_setTransformOrigin(e){if(!this._transformOriginSelector)return;let t=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,o=e.overlayY;e.overlayX==="center"?i="center":this._isRtl()?i=e.overlayX==="start"?"right":"left":i=e.overlayX==="start"?"left":"right";for(let r=0;r<t.length;r++)t[r].style.transformOrigin=`${i} ${o}`}_calculateBoundingBoxRect(e,t){let i=this._viewportRect,o=this._isRtl(),r,a,l;if(t.overlayY==="top")a=e.y,r=i.height-a+this._getViewportMarginBottom();else if(t.overlayY==="bottom")l=i.height-e.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=i.height-l+this._getViewportMarginTop();else{let F=Math.min(i.bottom-e.y+i.top,e.y),R=this._lastBoundingBoxSize.height;r=F*2,a=e.y-F,r>R&&!this._isInitialRender&&!this._growAfterOpen&&(a=e.y-R/2)}let c=t.overlayX==="start"&&!o||t.overlayX==="end"&&o,u=t.overlayX==="end"&&!o||t.overlayX==="start"&&o,d,p,I;if(u)I=i.width-e.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),d=e.x-this._getViewportMarginStart();else if(c)p=e.x,d=i.right-e.x-this._getViewportMarginEnd();else{let F=Math.min(i.right-e.x+i.left,e.x),R=this._lastBoundingBoxSize.width;d=F*2,p=e.x-F,d>R&&!this._isInitialRender&&!this._growAfterOpen&&(p=e.x-R/2)}return{top:a,left:p,bottom:l,right:I,width:d,height:r}}_setBoundingBoxStyles(e,t){let i=this._calculateBoundingBoxRect(e,t);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let o={};if(this._hasExactPosition())o.top=o.left="0",o.bottom=o.right="auto",o.maxHeight=o.maxWidth="",o.width=o.height="100%";else{let r=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;o.width=S(i.width),o.height=S(i.height),o.top=S(i.top)||"auto",o.bottom=S(i.bottom)||"auto",o.left=S(i.left)||"auto",o.right=S(i.right)||"auto",t.overlayX==="center"?o.alignItems="center":o.alignItems=t.overlayX==="end"?"flex-end":"flex-start",t.overlayY==="center"?o.justifyContent="center":o.justifyContent=t.overlayY==="bottom"?"flex-end":"flex-start",r&&(o.maxHeight=S(r)),a&&(o.maxWidth=S(a))}this._lastBoundingBoxSize=i,ft(this._boundingBox.style,o)}_resetBoundingBoxStyles(){ft(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){ft(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(e,t){let i={},o=this._hasExactPosition(),r=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(o){let d=this._viewportRuler.getViewportScrollPosition();ft(i,this._getExactOverlayY(t,e,d)),ft(i,this._getExactOverlayX(t,e,d))}else i.position="static";let l="",c=this._getOffset(t,"x"),u=this._getOffset(t,"y");c&&(l+=`translateX(${c}px) `),u&&(l+=`translateY(${u}px)`),i.transform=l.trim(),a.maxHeight&&(o?i.maxHeight=S(a.maxHeight):r&&(i.maxHeight="")),a.maxWidth&&(o?i.maxWidth=S(a.maxWidth):r&&(i.maxWidth="")),ft(this._pane.style,i)}_getExactOverlayY(e,t,i){let o={top:"",bottom:""},r=this._getOverlayPoint(t,this._overlayRect,e);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,i)),e.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;o.bottom=`${a-(r.y+this._overlayRect.height)}px`}else o.top=S(r.y);return o}_getExactOverlayX(e,t,i){let o={left:"",right:""},r=this._getOverlayPoint(t,this._overlayRect,e);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,i));let a;if(this._isRtl()?a=e.overlayX==="end"?"left":"right":a=e.overlayX==="end"?"right":"left",a==="right"){let l=this._document.documentElement.clientWidth;o.right=`${l-(r.x+this._overlayRect.width)}px`}else o.left=S(r.x);return o}_getScrollVisibility(){let e=this._getOriginRect(),t=this._pane.getBoundingClientRect(),i=this._scrollables.map(o=>o.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:pi(e,i),isOriginOutsideView:vn(e,i),isOverlayClipped:pi(t,i),isOverlayOutsideView:vn(t,i)}}_subtractOverflows(e,...t){return t.reduce((i,o)=>i-Math.max(o,0),e)}_getNarrowedViewportRect(){let e=this._document.documentElement.clientWidth,t=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+e-this._getViewportMarginEnd(),bottom:i.top+t-this._getViewportMarginBottom(),width:e-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:t-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(e,t){return t==="x"?e.offsetX==null?this._offsetX:e.offsetX:e.offsetY==null?this._offsetY:e.offsetY}_validatePositions(){}_addPanelClasses(e){this._pane&&Dt(e).forEach(t=>{t!==""&&this._appliedPanelClasses.indexOf(t)===-1&&(this._appliedPanelClasses.push(t),this._pane.classList.add(t))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(e=>{this._pane.classList.remove(e)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let e=this._origin;if(e instanceof C)return e.nativeElement.getBoundingClientRect();if(e instanceof Element)return e.getBoundingClientRect();let t=e.width||0,i=e.height||0;return{top:e.y,bottom:e.y+i,left:e.x,right:e.x+t,height:i,width:t}}_getContainerRect(){let e=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",t=this._overlayContainer.getContainerElement();e&&(t.style.display="block");let i=t.getBoundingClientRect();return e&&(t.style.display=""),i}};function ft(n,e){for(let t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n}function bi(n){if(typeof n!="number"&&n!=null){let[e,t]=n.split(ir);return!t||t==="px"?parseFloat(e):null}return n||null}function vi(n){return{top:Math.floor(n.top),right:Math.floor(n.right),bottom:Math.floor(n.bottom),left:Math.floor(n.left),width:Math.floor(n.width),height:Math.floor(n.height)}}function or(n,e){return n===e?!0:n.isOriginClipped===e.isOriginClipped&&n.isOriginOutsideView===e.isOriginOutsideView&&n.isOverlayClipped===e.isOverlayClipped&&n.isOverlayOutsideView===e.isOverlayOutsideView}var yi="cdk-global-overlay-wrapper";function Rt(n){return new Re}var Re=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(e){let t=e.getConfig();this._overlayRef=e,this._width&&!t.width&&e.updateSize({width:this._width}),this._height&&!t.height&&e.updateSize({height:this._height}),e.hostElement.classList.add(yi),this._isDisposed=!1}top(e=""){return this._bottomOffset="",this._topOffset=e,this._alignItems="flex-start",this}left(e=""){return this._xOffset=e,this._xPosition="left",this}bottom(e=""){return this._topOffset="",this._bottomOffset=e,this._alignItems="flex-end",this}right(e=""){return this._xOffset=e,this._xPosition="right",this}start(e=""){return this._xOffset=e,this._xPosition="start",this}end(e=""){return this._xOffset=e,this._xPosition="end",this}width(e=""){return this._overlayRef?this._overlayRef.updateSize({width:e}):this._width=e,this}height(e=""){return this._overlayRef?this._overlayRef.updateSize({height:e}):this._height=e,this}centerHorizontally(e=""){return this.left(e),this._xPosition="center",this}centerVertically(e=""){return this.top(e),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:o,height:r,maxWidth:a,maxHeight:l}=i,c=(o==="100%"||o==="100vw")&&(!a||a==="100%"||a==="100vw"),u=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),d=this._xPosition,p=this._xOffset,I=this._overlayRef.getConfig().direction==="rtl",F="",R="",O="";c?O="flex-start":d==="center"?(O="center",I?R=p:F=p):I?d==="left"||d==="end"?(O="flex-end",F=p):(d==="right"||d==="start")&&(O="flex-start",R=p):d==="left"||d==="start"?(O="flex-start",F=p):(d==="right"||d==="end")&&(O="flex-end",R=p),e.position=this._cssPosition,e.marginLeft=c?"0":F,e.marginTop=u?"0":this._topOffset,e.marginBottom=this._bottomOffset,e.marginRight=c?"0":R,t.justifyContent=O,t.alignItems=u?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement,i=t.style;t.classList.remove(yi),i.justifyContent=i.alignItems=e.marginTop=e.marginBottom=e.marginLeft=e.marginRight=e.position="",this._overlayRef=null,this._isDisposed=!0}},Oi=(()=>{class n{_injector=s(v);constructor(){}global(){return Rt()}flexibleConnectedTo(t){return Si(this._injector,t)}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),ki=new g("OVERLAY_DEFAULT_CONFIG");function Fe(n,e){n.get(q).load(Mi);let t=n.get(Ie),i=n.get(x),o=n.get(J),r=n.get(lt),a=n.get(ut),l=n.get(L,null,{optional:!0})||n.get(z).createRenderer(null,null),c=new St(e),u=n.get(ki,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||a.value,"showPopover"in i.body?c.usePopover=e?.usePopover??u:c.usePopover=!1;let d=i.createElement("div"),p=i.createElement("div");d.id=o.getId("cdk-overlay-"),d.classList.add("cdk-overlay-pane"),p.appendChild(d),c.usePopover&&(p.setAttribute("popover","manual"),p.classList.add("cdk-overlay-popover"));let I=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return Cn(I)?I.after(p):I?.type==="parent"?I.element.appendChild(p):t.getContainerElement().appendChild(p),new Ot(new Ee(d,r,n),p,d,c,n.get(y),n.get(xi),i,n.get(li),n.get(Ai),e?.disableAnimations??n.get(pe,null,{optional:!0})==="NoopAnimations",n.get(vt),l)}var Ri=(()=>{class n{scrollStrategies=s(Di);_positionBuilder=s(Oi);_injector=s(v);constructor(){}create(t){return Fe(this._injector,t)}position(){return this._positionBuilder}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Xt=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({providers:[Ri],imports:[Y,mt,gn,gn]})}return n})();function Zt(n){return n.buttons===0||n.detail===0}function Kt(n){let e=n.touches&&n.touches[0]||n.changedTouches&&n.changedTouches[0];return!!e&&e.identifier===-1&&(e.radiusX==null||e.radiusX===1)&&(e.radiusY==null||e.radiusY===1)}var qt;function Ii(){if(qt==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>qt=!0}))}finally{qt=qt||!1}return qt}function It(n){return Ii()?n:!!n.capture}var Fi=new g("cdk-input-modality-detector-options"),Ti={ignoreKeys:[18,17,224,91,16]},Vi=650,wn={passive:!0,capture:!0},Pi=(()=>{class n{_platform=s(M);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Yn(null);_options;_lastTouchMs=0;_onKeydown=t=>{this._options?.ignoreKeys?.some(i=>i===t.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=N(t))};_onMousedown=t=>{Date.now()-this._lastTouchMs<Vi||(this._modality.next(Zt(t)?"keyboard":"mouse"),this._mostRecentTarget=N(t))};_onTouchstart=t=>{if(Kt(t)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=N(t)};constructor(){let t=s(y),i=s(x),o=s(Fi,{optional:!0});if(this._options=f(f({},Ti),o),this.modalityDetected=this._modality.pipe(me(1)),this.modalityChanged=this.modalityDetected.pipe(tn()),this._platform.isBrowser){let r=s(z).createRenderer(null,null);this._listenerCleanups=t.runOutsideAngular(()=>[r.listen(i,"keydown",this._onKeydown,wn),r.listen(i,"mousedown",this._onMousedown,wn),r.listen(i,"touchstart",this._onTouchstart,wn)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(t=>t())}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),Qt=(function(n){return n[n.IMMEDIATE=0]="IMMEDIATE",n[n.EVENTUAL=1]="EVENTUAL",n})(Qt||{}),Ni=new g("cdk-focus-monitor-default-options"),Te=It({passive:!0,capture:!0}),Jt=(()=>{class n{_ngZone=s(y);_platform=s(M);_inputModalityDetector=s(Pi);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=s(x);_stopInputModalityDetector=new _;constructor(){let t=s(Ni,{optional:!0});this._detectionMode=t?.detectionMode||Qt.IMMEDIATE}_rootNodeFocusAndBlurListener=t=>{let i=N(t);for(let o=i;o;o=o.parentElement)t.type==="focus"?this._onFocus(t,o):this._onBlur(t,o)};monitor(t,i=!1){let o=Q(t);if(!this._platform.isBrowser||o.nodeType!==1)return ue();let r=fn(o)||this._document,a=this._elementInfo.get(o);if(a)return i&&(a.checkChildren=!0),a.subject;let l={checkChildren:i,subject:new _,rootNode:r};return this._elementInfo.set(o,l),this._registerGlobalListeners(l),l.subject}stopMonitoring(t){let i=Q(t),o=this._elementInfo.get(i);o&&(o.subject.complete(),this._setClasses(i),this._elementInfo.delete(i),this._removeGlobalListeners(o))}focusVia(t,i,o){let r=Q(t),a=this._document.activeElement;r===a?this._getClosestElementsInfo(r).forEach(([l,c])=>this._originChanged(l,i,c)):(this._setOrigin(i),typeof r.focus=="function"&&r.focus(o))}ngOnDestroy(){this._elementInfo.forEach((t,i)=>this.stopMonitoring(i))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(t){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(t)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:t&&this._isLastInteractionFromInputLabel(t)?"mouse":"program"}_shouldBeAttributedToTouch(t){return this._detectionMode===Qt.EVENTUAL||!!t?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(t,i){t.classList.toggle("cdk-focused",!!i),t.classList.toggle("cdk-touch-focused",i==="touch"),t.classList.toggle("cdk-keyboard-focused",i==="keyboard"),t.classList.toggle("cdk-mouse-focused",i==="mouse"),t.classList.toggle("cdk-program-focused",i==="program")}_setOrigin(t,i=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=t,this._originFromTouchInteraction=t==="touch"&&i,this._detectionMode===Qt.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?Vi:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(t,i){let o=this._elementInfo.get(i),r=N(t);!o||!o.checkChildren&&i!==r||this._originChanged(i,this._getFocusOrigin(r),o)}_onBlur(t,i){let o=this._elementInfo.get(i);!o||o.checkChildren&&t.relatedTarget instanceof Node&&i.contains(t.relatedTarget)||(this._setClasses(i),this._emitOrigin(o,null))}_emitOrigin(t,i){t.subject.observers.length&&this._ngZone.run(()=>t.subject.next(i))}_registerGlobalListeners(t){if(!this._platform.isBrowser)return;let i=t.rootNode,o=this._rootNodeFocusListenerCount.get(i)||0;o||this._ngZone.runOutsideAngular(()=>{i.addEventListener("focus",this._rootNodeFocusAndBlurListener,Te),i.addEventListener("blur",this._rootNodeFocusAndBlurListener,Te)}),this._rootNodeFocusListenerCount.set(i,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(Nt(this._stopInputModalityDetector)).subscribe(r=>{this._setOrigin(r,!0)}))}_removeGlobalListeners(t){let i=t.rootNode;if(this._rootNodeFocusListenerCount.has(i)){let o=this._rootNodeFocusListenerCount.get(i);o>1?this._rootNodeFocusListenerCount.set(i,o-1):(i.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Te),i.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Te),this._rootNodeFocusListenerCount.delete(i))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(t,i,o){this._setClasses(t,i),this._emitOrigin(o,i),this._lastFocusOrigin=i}_getClosestElementsInfo(t){let i=[];return this._elementInfo.forEach((o,r)=>{(r===t||o.checkChildren&&r.contains(t))&&i.push([r,o])}),i}_isLastInteractionFromInputLabel(t){let{_mostRecentTarget:i,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!i||i===t||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA"||t.disabled)return!1;let r=t.labels;if(r){for(let a=0;a<r.length;a++)if(r[a].contains(i))return!0}return!1}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Li=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(i,o){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2,changeDetection:0})}return n})();var Bi=new Set,pt,Ve=(()=>{class n{_platform=s(M);_nonce=s(ei,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):ar}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&rr(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function rr(n,e){if(!Bi.has(n))try{pt||(pt=document.createElement("style"),e&&pt.setAttribute("nonce",e),pt.setAttribute("type","text/css"),document.head.appendChild(pt)),pt.sheet&&(pt.sheet.insertRule(`@media ${n} {body{ }}`,0),Bi.add(n))}catch(t){console.error(t)}}function ar(n){return{matches:n==="all"||n==="",media:n,addListener:()=>{},removeListener:()=>{}}}var Dn=(()=>{class n{_mediaMatcher=s(Ve);_zone=s(y);_queries=new Map;_destroySubject=new _;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return ji(Dt(t)).some(o=>this._registerQuery(o).mql.matches)}observe(t){let o=ji(Dt(t)).map(a=>this._registerQuery(a).observable),r=Xn(o);return r=Zn(r.pipe(nt(1)),r.pipe(me(1),Qn(0))),r.pipe(Pt(a=>{let l={matches:!1,breakpoints:{}};return a.forEach(({matches:c,query:u})=>{l.matches=l.matches||c,l.breakpoints[u]=c}),l}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);let i=this._mediaMatcher.matchMedia(t),r={observable:new de(a=>{let l=c=>this._zone.run(()=>a.next(c));return i.addListener(l),()=>{i.removeListener(l)}}).pipe(st(i),Pt(({matches:a})=>({query:t,matches:a})),Nt(this._destroySubject)),mql:i};return this._queries.set(t,r),r}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function ji(n){return n.map(e=>e.split(",")).reduce((e,t)=>e.concat(t)).map(e=>e.trim())}var sr=(()=>{class n{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var zi=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({providers:[sr]})}return n})();var An=(()=>{class n{_platform=s(M);constructor(){}isDisabled(t){return t.hasAttribute("disabled")}isVisible(t){return cr(t)&&getComputedStyle(t).visibility==="visible"}isTabbable(t){if(!this._platform.isBrowser)return!1;let i=lr(_r(t));if(i&&(Hi(i)===-1||!this.isVisible(i)))return!1;let o=t.nodeName.toLowerCase(),r=Hi(t);return t.hasAttribute("contenteditable")?r!==-1:o==="iframe"||o==="object"||this._platform.WEBKIT&&this._platform.IOS&&!pr(t)?!1:o==="audio"?t.hasAttribute("controls")?r!==-1:!1:o==="video"?r===-1?!1:r!==null?!0:this._platform.FIREFOX||t.hasAttribute("controls"):t.tabIndex>=0}isFocusable(t,i){return gr(t)&&!this.isDisabled(t)&&(i?.ignoreVisibility||this.isVisible(t))}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function lr(n){try{return n.frameElement}catch{return null}}function cr(n){return!!(n.offsetWidth||n.offsetHeight||typeof n.getClientRects=="function"&&n.getClientRects().length)}function dr(n){let e=n.nodeName.toLowerCase();return e==="input"||e==="select"||e==="button"||e==="textarea"}function ur(n){return mr(n)&&n.type=="hidden"}function hr(n){return fr(n)&&n.hasAttribute("href")}function mr(n){return n.nodeName.toLowerCase()=="input"}function fr(n){return n.nodeName.toLowerCase()=="a"}function Gi(n){if(!n.hasAttribute("tabindex")||n.tabIndex===void 0)return!1;let e=n.getAttribute("tabindex");return!!(e&&!isNaN(parseInt(e,10)))}function Hi(n){if(!Gi(n))return null;let e=parseInt(n.getAttribute("tabindex")||"",10);return isNaN(e)?-1:e}function pr(n){let e=n.nodeName.toLowerCase(),t=e==="input"&&n.type;return t==="text"||t==="password"||e==="select"||e==="textarea"}function gr(n){return ur(n)?!1:dr(n)||hr(n)||n.hasAttribute("contenteditable")||Gi(n)}function _r(n){return n.ownerDocument&&n.ownerDocument.defaultView||window}var xn=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>this.focusLastTabbableElement();endAnchorListener=()=>this.focusFirstTabbableElement();get enabled(){return this._enabled}set enabled(e){this._enabled=e,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_enabled=!0;constructor(e,t,i,o,r=!1,a){this._element=e,this._checker=t,this._ngZone=i,this._document=o,this._injector=a,r||this.attachAnchors()}destroy(){let e=this._startAnchor,t=this._endAnchor;e&&(e.removeEventListener("focus",this.startAnchorListener),e.remove()),t&&(t.removeEventListener("focus",this.endAnchorListener),t.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusInitialElement(e)))})}focusFirstTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusFirstTabbableElement(e)))})}focusLastTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusLastTabbableElement(e)))})}_getRegionBoundary(e){let t=this._element.querySelectorAll(`[cdk-focus-region-${e}], [cdkFocusRegion${e}], [cdk-focus-${e}]`);return e=="start"?t.length?t[0]:this._getFirstTabbableElement(this._element):t.length?t[t.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(e){let t=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(t){if(!this._checker.isFocusable(t)){let i=this._getFirstTabbableElement(t);return i?.focus(e),!!i}return t.focus(e),!0}return this.focusFirstTabbableElement(e)}focusFirstTabbableElement(e){let t=this._getRegionBoundary("start");return t&&t.focus(e),!!t}focusLastTabbableElement(e){let t=this._getRegionBoundary("end");return t&&t.focus(e),!!t}hasAttached(){return this._hasAttached}_getFirstTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let i=0;i<t.length;i++){let o=t[i].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(t[i]):null;if(o)return o}return null}_getLastTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let i=t.length-1;i>=0;i--){let o=t[i].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(t[i]):null;if(o)return o}return null}_createAnchor(){let e=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,e),e.classList.add("cdk-visually-hidden"),e.classList.add("cdk-focus-trap-anchor"),e.setAttribute("aria-hidden","true"),e}_toggleAnchorTabIndex(e,t){e?t.setAttribute("tabindex","0"):t.removeAttribute("tabindex")}toggleAnchors(e){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_executeOnStable(e){this._injector?Z(e,{injector:this._injector}):setTimeout(e)}},Yi=(()=>{class n{_checker=s(An);_ngZone=s(y);_document=s(x);_injector=s(v);constructor(){s(q).load(Li)}create(t,i=!1){return new xn(t,this._checker,this._ngZone,this._document,i,this._injector)}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var gt=(function(n){return n[n.NONE=0]="NONE",n[n.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",n[n.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",n})(gt||{}),Ui="cdk-high-contrast-black-on-white",Wi="cdk-high-contrast-white-on-black",En="cdk-high-contrast-active",br=(()=>{class n{_platform=s(M);_hasCheckedHighContrastMode=!1;_document=s(x);_breakpointSubscription;constructor(){this._breakpointSubscription=s(Dn).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return gt.NONE;let t=this._document.createElement("div");t.style.backgroundColor="rgb(1,2,3)",t.style.position="absolute",this._document.body.appendChild(t);let i=this._document.defaultView||window,o=i&&i.getComputedStyle?i.getComputedStyle(t):null,r=(o&&o.backgroundColor||"").replace(/ /g,"");switch(t.remove(),r){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return gt.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return gt.BLACK_ON_WHITE}return gt.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let t=this._document.body.classList;t.remove(En,Ui,Wi),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===gt.BLACK_ON_WHITE?t.add(En,Ui):i===gt.WHITE_ON_BLACK&&t.add(En,Wi)}}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),$i=(()=>{class n{constructor(){s(br)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({imports:[zi]})}return n})();function vr(n,e){}var ot=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext};var Sn=(()=>{class n extends Mt{_elementRef=s(C);_focusTrapFactory=s(Yi);_config;_interactivityChecker=s(An);_ngZone=s(y);_focusMonitor=s(Jt);_renderer=s(L);_changeDetectorRef=s(wt);_injector=s(v);_platform=s(M);_document=s(x);_portalOutlet;_focusTrapped=new _;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=s(ot,{optional:!0})||new ot,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(t){this._ariaLabelledByQueue.push(t),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(t){let i=this._ariaLabelledByQueue.indexOf(t);i>-1&&(this._ariaLabelledByQueue.splice(i,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(t){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachComponentPortal(t);return this._contentAttached(),i}attachTemplatePortal(t){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachTemplatePortal(t);return this._contentAttached(),i}attachDomPortal=t=>{this._portalOutlet.hasAttached();let i=this._portalOutlet.attachDomPortal(t);return this._contentAttached(),i};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(t,i){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{r(),a(),t.removeAttribute("tabindex")},r=this._renderer.listen(t,"blur",o),a=this._renderer.listen(t,"mousedown",o)})),t.focus(i)}_focusByCssSelector(t,i){let o=this._elementRef.nativeElement.querySelector(t);o&&this._forceFocus(o,i)}_trapFocus(t){this._isDestroyed||Z(()=>{let i=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||i.focus(t);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(t)||this._focusDialogContainer(t);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',t);break;default:this._focusByCssSelector(this._config.autoFocus,t);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let t=this._config.restoreFocus,i=null;if(typeof t=="string"?i=this._document.querySelector(t):typeof t=="boolean"?i=t?this._elementFocusedBeforeDialogWasOpened:null:t&&(i=t),this._config.restoreFocus&&i&&typeof i.focus=="function"){let o=Ht(),r=this._elementRef.nativeElement;(!o||o===this._document.body||o===r||r.contains(o))&&(this._focusMonitor?(this._focusMonitor.focusVia(i,this._closeInteractionType),this._closeInteractionType=null):i.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(t){this._elementRef.nativeElement.focus?.(t)}_containsFocus(){let t=this._elementRef.nativeElement,i=Ht();return t===i||t.contains(i)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Ht()))}static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["cdk-dialog-container"]],viewQuery:function(i,o){if(i&1&&sn(Yt,7),i&2){let r;ln(r=cn())&&(o._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(i,o){i&2&&H("id",o._config.id||null)("role",o._config.role)("aria-modal",o._config.ariaModal)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null)},features:[D],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(i,o){i&1&&_e(0,vr,0,0,"ng-template",0)},dependencies:[Yt],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2})}return n})(),te=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new _;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(e,t){this.overlayRef=e,this.config=t,this.disableClose=t.disableClose,this.backdropClick=e.backdropClick(),this.keydownEvents=e.keydownEvents(),this.outsidePointerEvents=e.outsidePointerEvents(),this.id=t.id,this.keydownEvents.subscribe(i=>{i.keyCode===27&&!this.disableClose&&!xe(i)&&(i.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=e.detachments().subscribe(()=>{t.closeOnOverlayDetachments!==!1&&this.close()})}close(e,t){if(this._canClose(e)){let i=this.closed;this.containerInstance._closeInteractionType=t?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),i.next(e),i.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(e="",t=""){return this.overlayRef.updateSize({width:e,height:t}),this}addPanelClass(e){return this.overlayRef.addPanelClass(e),this}removePanelClass(e){return this.overlayRef.removePanelClass(e),this}_canClose(e){let t=this.config;return!!this.containerInstance&&(!t.closePredicate||t.closePredicate(e,t,this.componentInstance))}},yr=new g("DialogScrollStrategy",{providedIn:"root",factory:()=>{let n=s(v);return()=>kt(n)}}),Cr=new g("DialogData"),wr=new g("DefaultDialogConfig");function Dr(n){let e=X(n),t=new T;return{valueSignal:e,get value(){return e()},change:t,ngOnDestroy(){t.complete()}}}var On=(()=>{class n{_injector=s(v);_defaultOptions=s(wr,{optional:!0});_parentDialog=s(n,{optional:!0,skipSelf:!0});_overlayContainer=s(Ie);_idGenerator=s(J);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new _;_afterOpenedAtThisLevel=new _;_ariaHiddenElements=new Map;_scrollStrategy=s(yr);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=he(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));constructor(){}open(t,i){let o=this._defaultOptions||new ot;i=f(f({},o),i),i.id=i.id||this._idGenerator.getId("cdk-dialog-"),i.id&&this.getDialogById(i.id);let r=this._getOverlayConfig(i),a=Fe(this._injector,r),l=new te(a,i),c=this._attachContainer(a,l,i);if(l.containerInstance=c,!this.openDialogs.length){let u=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(nt(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(u)}):this._hideNonDialogContentFromAssistiveTechnology(u)}return this._attachDialogContent(t,l,c,i),this.openDialogs.push(l),l.closed.subscribe(()=>this._removeOpenDialog(l,!0)),this.afterOpened.next(l),l}closeAll(){Mn(this.openDialogs,t=>t.close())}getDialogById(t){return this.openDialogs.find(i=>i.id===t)}ngOnDestroy(){Mn(this._openDialogsAtThisLevel,t=>{t.config.closeOnDestroy===!1&&this._removeOpenDialog(t,!1)}),Mn(this._openDialogsAtThisLevel,t=>t.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(t){let i=new St({positionStrategy:t.positionStrategy||Rt().centerHorizontally().centerVertically(),scrollStrategy:t.scrollStrategy||this._scrollStrategy(),panelClass:t.panelClass,hasBackdrop:t.hasBackdrop,direction:t.direction,minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight,width:t.width,height:t.height,disposeOnNavigation:t.closeOnNavigation,disableAnimations:t.disableAnimations});return t.backdropClass&&(i.backdropClass=t.backdropClass),i}_attachContainer(t,i,o){let r=o.injector||o.viewContainerRef?.injector,a=[{provide:ot,useValue:o},{provide:te,useValue:i},{provide:Ot,useValue:t}],l;o.container?typeof o.container=="function"?l=o.container:(l=o.container.type,a.push(...o.container.providers(o))):l=Sn;let c=new xt(l,o.viewContainerRef,v.create({parent:r||this._injector,providers:a}));return t.attach(c).instance}_attachDialogContent(t,i,o,r){if(t instanceof Lt){let a=this._createInjector(r,i,o,void 0),l={$implicit:r.data,dialogRef:i};r.templateContext&&(l=f(f({},l),typeof r.templateContext=="function"?r.templateContext():r.templateContext)),o.attachTemplatePortal(new At(t,null,l,a))}else{let a=this._createInjector(r,i,o,this._injector),l=o.attachComponentPortal(new xt(t,r.viewContainerRef,a));i.componentRef=l,i.componentInstance=l.instance}}_createInjector(t,i,o,r){let a=t.injector||t.viewContainerRef?.injector,l=[{provide:Cr,useValue:t.data},{provide:te,useValue:i}];return t.providers&&(typeof t.providers=="function"?l.push(...t.providers(i,t,o)):l.push(...t.providers)),t.direction&&(!a||!a.get(ut,null,{optional:!0}))&&l.push({provide:ut,useValue:Dr(t.direction)}),v.create({parent:a||r,providers:l})}_removeOpenDialog(t,i){let o=this.openDialogs.indexOf(t);o>-1&&(this.openDialogs.splice(o,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((r,a)=>{r?a.setAttribute("aria-hidden",r):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),i&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(t){if(t.parentElement){let i=t.parentElement.children;for(let o=i.length-1;o>-1;o--){let r=i[o];r!==t&&r.nodeName!=="SCRIPT"&&r.nodeName!=="STYLE"&&!r.hasAttribute("aria-live")&&!r.hasAttribute("popover")&&(this._ariaHiddenElements.set(r,r.getAttribute("aria-hidden")),r.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();function Mn(n,e){let t=n.length;for(;t--;)e(n[t])}var Zi=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({providers:[On],imports:[Xt,mt,$i,mt]})}return n})();var Er=new g("MATERIAL_ANIMATIONS"),Ki=null;function xr(){return s(Er,{optional:!0})?.animationsDisabled||s(pe,{optional:!0})==="NoopAnimations"?"di-disabled":(Ki??=s(Ve).matchMedia("(prefers-reduced-motion)").matches,Ki?"reduced-motion":"enabled")}function _t(){return xr()!=="enabled"}function Ar(n,e){}var Ne=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration},kn="mdc-dialog--open",qi="mdc-dialog--opening",Qi="mdc-dialog--closing",Mr=150,Sr=75,Or=(()=>{class n extends Sn{_animationStateChanged=new T;_animationsEnabled=!_t();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?to(this._config.enterAnimationDuration)??Mr:0;_exitAnimationDuration=this._animationsEnabled?to(this._config.exitAnimationDuration)??Sr:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(Ji,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(qi,kn)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(kn),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(kn),this._animationsEnabled?(this._hostElement.style.setProperty(Ji,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Qi)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(t){this._actionSectionCount+=t,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(qi,Qi)}_waitForAnimationToComplete(t,i){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(i,t)}_requestAnimationFrame(t){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(t):t()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(t){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:t})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(t){let i=super.attachComponentPortal(t);return i.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),i}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275cmp=k({type:n,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(i,o){i&2&&(an("id",o._config.id),H("aria-modal",o._config.ariaModal)("role",o._config.role)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null),B("_mat-animation-noopable",!o._animationsEnabled)("mat-mdc-dialog-container-with-actions",o._actionSectionCount>0))},features:[D],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(i,o){i&1&&(ct(0,"div",0)(1,"div",1),_e(2,Ar,0,0,"ng-template",2),dt()())},dependencies:[Yt],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--mat-dialog-container-max-width, 560px);
  min-width: var(--mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--mat-dialog-container-elevation-shadow, none);
  border-radius: var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));
  background-color: var(--mat-dialog-container-color, var(--mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));
  line-height: var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));
  font-weight: var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));
  letter-spacing: var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));
  line-height: var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));
  font-weight: var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));
  letter-spacing: var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2})}return n})(),Ji="--mat-dialog-transition-duration";function to(n){return n==null?null:typeof n=="number"?n:n.endsWith("ms")?Ut(n.substring(0,n.length-2)):n.endsWith("s")?Ut(n.substring(0,n.length-1))*1e3:n==="0"?0:null}var Pe=(function(n){return n[n.OPEN=0]="OPEN",n[n.CLOSING=1]="CLOSING",n[n.CLOSED=2]="CLOSED",n})(Pe||{}),bt=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new Qe(1);_beforeClosed=new Qe(1);_result;_closeFallbackTimeout;_state=Pe.OPEN;_closeInteractionType;constructor(e,t,i){this._ref=e,this._config=t,this._containerInstance=i,this.disableClose=t.disableClose,this.id=e.id,e.addPanelClass("mat-mdc-dialog-panel"),i._animationStateChanged.pipe(tt(o=>o.state==="opened"),nt(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),i._animationStateChanged.pipe(tt(o=>o.state==="closed"),nt(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),e.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),qn(this.backdropClick(),this.keydownEvents().pipe(tt(o=>o.keyCode===27&&!this.disableClose&&!xe(o)))).subscribe(o=>{this.disableClose||(o.preventDefault(),eo(this,o.type==="keydown"?"keyboard":"mouse"))})}close(e){let t=this._config.closePredicate;t&&!t(e,this._config,this.componentInstance)||(this._result=e,this._containerInstance._animationStateChanged.pipe(tt(i=>i.state==="closing"),nt(1)).subscribe(i=>{this._beforeClosed.next(e),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),i.totalTime+100)}),this._state=Pe.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(e){let t=this._ref.config.positionStrategy;return e&&(e.left||e.right)?e.left?t.left(e.left):t.right(e.right):t.centerHorizontally(),e&&(e.top||e.bottom)?e.top?t.top(e.top):t.bottom(e.bottom):t.centerVertically(),this._ref.updatePosition(),this}updateSize(e="",t=""){return this._ref.updateSize(e,t),this}addPanelClass(e){return this._ref.addPanelClass(e),this}removePanelClass(e){return this._ref.removePanelClass(e),this}getState(){return this._state}_finishDialogClose(){this._state=Pe.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function eo(n,e,t){return n._closeInteractionType=e,n.close(t)}var Rn=new g("MatMdcDialogData"),kr=new g("mat-mdc-dialog-default-options"),Rr=new g("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let n=s(v);return()=>kt(n)}}),In=(()=>{class n{_defaultOptions=s(kr,{optional:!0});_scrollStrategy=s(Rr);_parentDialog=s(n,{optional:!0,skipSelf:!0});_idGenerator=s(J);_injector=s(v);_dialog=s(On);_animationsDisabled=_t();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new _;_afterOpenedAtThisLevel=new _;dialogConfigClass=Ne;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=he(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));constructor(){this._dialogRefConstructor=bt,this._dialogContainerType=Or,this._dialogDataToken=Rn}open(t,i){let o;i=f(f({},this._defaultOptions||new Ne),i),i.id=i.id||this._idGenerator.getId("mat-mdc-dialog-"),i.scrollStrategy=i.scrollStrategy||this._scrollStrategy();let r=this._dialog.open(t,V(f({},i),{positionStrategy:Rt(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||i.enterAnimationDuration?.toLocaleString()==="0"||i.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:i},{provide:ot,useValue:i}]},templateContext:()=>({dialogRef:o}),providers:(a,l,c)=>(o=new this._dialogRefConstructor(a,i,c),o.updatePosition(i?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:l.data},{provide:this._dialogRefConstructor,useValue:o}])}));return o.componentRef=r.componentRef,o.componentInstance=r.componentInstance,this.openDialogs.push(o),this.afterOpened.next(o),o.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(o);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),o}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(t){return this.openDialogs.find(i=>i.id===t)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(t){let i=t.length;for(;i--;)t[i].close()}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),no=(()=>{class n{dialogRef=s(bt,{optional:!0});_elementRef=s(C);_dialog=s(In);ariaLabel;type="button";dialogResult;_matDialogClose;constructor(){}ngOnInit(){this.dialogRef||(this.dialogRef=so(this._elementRef,this._dialog.openDialogs))}ngOnChanges(t){let i=t._matDialogClose||t._matDialogCloseResult;i&&(this.dialogResult=i.currentValue)}_onButtonClick(t){eo(this.dialogRef,t.screenX===0&&t.screenY===0?"keyboard":"mouse",this.dialogResult)}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,selectors:[["","mat-dialog-close",""],["","matDialogClose",""]],hostVars:2,hostBindings:function(i,o){i&1&&K("click",function(a){return o._onButtonClick(a)}),i&2&&H("aria-label",o.ariaLabel||null)("type",o.type)},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],type:"type",dialogResult:[0,"mat-dialog-close","dialogResult"],_matDialogClose:[0,"matDialogClose","_matDialogClose"]},exportAs:["matDialogClose"],features:[it]})}return n})(),io=(()=>{class n{_dialogRef=s(bt,{optional:!0});_elementRef=s(C);_dialog=s(In);constructor(){}ngOnInit(){this._dialogRef||(this._dialogRef=so(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n})}return n})(),oo=(()=>{class n extends io{id=s(J).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(i,o){i&2&&an("id",o.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[D]})}return n})(),ro=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[ni([mi])]})}return n})(),ao=(()=>{class n extends io{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(i,o){i&2&&B("mat-mdc-dialog-actions-align-start",o.align==="start")("mat-mdc-dialog-actions-align-center",o.align==="center")("mat-mdc-dialog-actions-align-end",o.align==="end")},inputs:{align:"align"},features:[D]})}return n})();function so(n,e){let t=n.nativeElement.parentElement;for(;t&&!t.classList.contains("mat-mdc-dialog-container");)t=t.parentElement;return t?e.find(i=>i.id===t.id):null}var lo=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({providers:[In],imports:[Zi,Xt,mt,Y]})}return n})();var vo=(()=>{class n{_renderer;_elementRef;onChange=t=>{};onTouched=()=>{};constructor(t,i){this._renderer=t,this._elementRef=i}setProperty(t,i){this._renderer.setProperty(this._elementRef.nativeElement,t,i)}registerOnTouched(t){this.onTouched=t}registerOnChange(t){this.onChange=t}setDisabledState(t){this.setProperty("disabled",t)}static \u0275fac=function(i){return new(i||n)(E(L),E(C))};static \u0275dir=m({type:n})}return n})(),Ye=(()=>{class n extends vo{static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,features:[D]})}return n})(),se=new g("");var Fr={provide:se,useExisting:$(()=>yo),multi:!0};function Tr(){let n=un()?un().getUserAgent():"";return/android (\d+)/.test(n.toLowerCase())}var Vr=new g(""),yo=(()=>{class n extends vo{_compositionMode;_composing=!1;constructor(t,i,o){super(t,i),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!Tr())}writeValue(t){let i=t??"";this.setProperty("value",i)}_handleInput(t){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(t)}_compositionStart(){this._composing=!0}_compositionEnd(t){this._composing=!1,this._compositionMode&&this.onChange(t)}static \u0275fac=function(i){return new(i||n)(E(L),E(C),E(Vr,8))};static \u0275dir=m({type:n,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(i,o){i&1&&K("input",function(a){return o._handleInput(a.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(a){return o._compositionEnd(a.target.value)})},standalone:!1,features:[U([Fr]),D]})}return n})();function Pr(n){return n==null||Nr(n)===0}function Nr(n){return n==null?null:Array.isArray(n)||typeof n=="string"?n.length:n instanceof Set?n.size:null}var $e=new g(""),Co=new g("");function Lr(n){return e=>{if(e.value==null||n==null)return null;let t=parseFloat(e.value);return!isNaN(t)&&t<n?{min:{min:n,actual:e.value}}:null}}function Br(n){return Pr(n.value)?{required:!0}:null}function co(n){return null}function wo(n){return n!=null}function Do(n){return ii(n)?$n(n):n}function Eo(n){let e={};return n.forEach(t=>{e=t!=null?f(f({},e),t):e}),Object.keys(e).length===0?null:e}function xo(n,e){return e.map(t=>t(n))}function jr(n){return!n.validate}function Ao(n){return n.map(e=>jr(e)?e:t=>e.validate(t))}function zr(n){if(!n)return null;let e=n.filter(wo);return e.length==0?null:function(t){return Eo(xo(t,e))}}function Vn(n){return n!=null?zr(Ao(n)):null}function Hr(n){if(!n)return null;let e=n.filter(wo);return e.length==0?null:function(t){let i=xo(t,e).map(Do);return Kn(i).pipe(Pt(Eo))}}function Pn(n){return n!=null?Hr(Ao(n)):null}function uo(n,e){return n===null?[e]:Array.isArray(n)?[...n,e]:[n,e]}function Ur(n){return n._rawValidators}function Wr(n){return n._rawAsyncValidators}function Fn(n){return n?Array.isArray(n)?n:[n]:[]}function Be(n,e){return Array.isArray(n)?n.includes(e):n===e}function ho(n,e){let t=Fn(e);return Fn(n).forEach(o=>{Be(t,o)||t.push(o)}),t}function mo(n,e){return Fn(e).filter(t=>!Be(n,t))}var je=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=Vn(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=Pn(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control?.reset(e)}hasError(e,t){return this.control?this.control.hasError(e,t):!1}getError(e,t){return this.control?this.control.getError(e,t):null}},Vt=class extends je{name;get formDirective(){return null}get path(){return null}},ae=class extends je{_parent=null;name=null;valueAccessor=null},ze=class{_cd;constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var yd=(()=>{class n extends ze{constructor(t){super(t)}static \u0275fac=function(i){return new(i||n)(E(ae,2))};static \u0275dir=m({type:n,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,o){i&2&&B("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[D]})}return n})(),Cd=(()=>{class n extends ze{constructor(t){super(t)}static \u0275fac=function(i){return new(i||n)(E(Vt,10))};static \u0275dir=m({type:n,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["","formArray",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(i,o){i&2&&B("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)("ng-submitted",o.isSubmitted)},standalone:!1,features:[D]})}return n})();var ee="VALID",Le="INVALID",Ft="PENDING",ne="DISABLED",rt=class{},He=class extends rt{value;source;constructor(e,t){super(),this.value=e,this.source=t}},oe=class extends rt{pristine;source;constructor(e,t){super(),this.pristine=e,this.source=t}},re=class extends rt{touched;source;constructor(e,t){super(),this.touched=e,this.source=t}},Tt=class extends rt{status;source;constructor(e,t){super(),this.status=e,this.source=t}},Tn=class extends rt{source;constructor(e){super(),this.source=e}},Ue=class extends rt{source;constructor(e){super(),this.source=e}};function Mo(n){return(Xe(n)?n.validators:n)||null}function Gr(n){return Array.isArray(n)?Vn(n):n||null}function So(n,e){return(Xe(e)?e.asyncValidators:n)||null}function Yr(n){return Array.isArray(n)?Pn(n):n||null}function Xe(n){return n!=null&&!Array.isArray(n)&&typeof n=="object"}function $r(n,e,t){let i=n.controls;if(!(e?Object.keys(i):i).length)throw new fe(1e3,"");if(!i[t])throw new fe(1001,"")}function Xr(n,e,t){n._forEachChild((i,o)=>{if(t[o]===void 0)throw new fe(-1002,"")})}var We=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(e,t){this._assignValidators(e),this._assignAsyncValidators(t)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return et(this.statusReactive)}set status(e){et(()=>this.statusReactive.set(e))}_status=zt(()=>this.statusReactive());statusReactive=X(void 0);get valid(){return this.status===ee}get invalid(){return this.status===Le}get pending(){return this.status===Ft}get disabled(){return this.status===ne}get enabled(){return this.status!==ne}errors;get pristine(){return et(this.pristineReactive)}set pristine(e){et(()=>this.pristineReactive.set(e))}_pristine=zt(()=>this.pristineReactive());pristineReactive=X(!0);get dirty(){return!this.pristine}get touched(){return et(this.touchedReactive)}set touched(e){et(()=>this.touchedReactive.set(e))}_touched=zt(()=>this.touchedReactive());touchedReactive=X(!1);get untouched(){return!this.touched}_events=new _;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(ho(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(ho(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(mo(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(mo(e,this._rawAsyncValidators))}hasValidator(e){return Be(this._rawValidators,e)}hasAsyncValidator(e){return Be(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let t=this.touched===!1;this.touched=!0;let i=e.sourceControl??this;e.onlySelf||this._parent?.markAsTouched(V(f({},e),{sourceControl:i})),t&&e.emitEvent!==!1&&this._events.next(new re(!0,i))}markAllAsDirty(e={}){this.markAsDirty({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsDirty(e))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsTouched(e))}markAsUntouched(e={}){let t=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=e.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:i})}),e.onlySelf||this._parent?._updateTouched(e,i),t&&e.emitEvent!==!1&&this._events.next(new re(!1,i))}markAsDirty(e={}){let t=this.pristine===!0;this.pristine=!1;let i=e.sourceControl??this;e.onlySelf||this._parent?.markAsDirty(V(f({},e),{sourceControl:i})),t&&e.emitEvent!==!1&&this._events.next(new oe(!1,i))}markAsPristine(e={}){let t=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=e.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),e.onlySelf||this._parent?._updatePristine(e,i),t&&e.emitEvent!==!1&&this._events.next(new oe(!0,i))}markAsPending(e={}){this.status=Ft;let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Tt(this.status,t)),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.markAsPending(V(f({},e),{sourceControl:t}))}disable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=ne,this.errors=null,this._forEachChild(o=>{o.disable(V(f({},e),{onlySelf:!0}))}),this._updateValue();let i=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new He(this.value,i)),this._events.next(new Tt(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(V(f({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=ee,this._forEachChild(i=>{i.enable(V(f({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(V(f({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(e,t){e.onlySelf||(this._parent?.updateValueAndValidity(e),e.skipPristineCheck||this._parent?._updatePristine({},t),this._parent?._updateTouched({},t))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===ee||this.status===Ft)&&this._runAsyncValidator(i,e.emitEvent)}let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new He(this.value,t)),this._events.next(new Tt(this.status,t)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.updateValueAndValidity(V(f({},e),{sourceControl:t}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(t=>t._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?ne:ee}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,t){if(this.asyncValidator){this.status=Ft,this._hasOwnPendingAsyncValidator={emitEvent:t!==!1,shouldHaveEmitted:e!==!1};let i=Do(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:t,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,t={}){this.errors=e,this._updateControlsErrors(t.emitEvent!==!1,this,t.shouldHaveEmitted)}get(e){let t=e;return t==null||(Array.isArray(t)||(t=t.split(".")),t.length===0)?null:t.reduce((i,o)=>i&&i._find(o),this)}getError(e,t){let i=t?this.get(t):this;return i?.errors?i.errors[e]:null}hasError(e,t){return!!this.getError(e,t)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,t,i){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||i)&&this._events.next(new Tt(this.status,t)),this._parent&&this._parent._updateControlsErrors(e,t,i)}_initObservables(){this.valueChanges=new T,this.statusChanges=new T}_calculateStatus(){return this._allControlsDisabled()?ne:this.errors?Le:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Ft)?Ft:this._anyControlsHaveStatus(Le)?Le:ee}_anyControlsHaveStatus(e){return this._anyControls(t=>t.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,t){let i=!this._anyControlsDirty(),o=this.pristine!==i;this.pristine=i,e.onlySelf||this._parent?._updatePristine(e,t),o&&this._events.next(new oe(this.pristine,t))}_updateTouched(e={},t){this.touched=this._anyControlsTouched(),this._events.next(new re(this.touched,t)),e.onlySelf||this._parent?._updateTouched(e,t)}_onDisabledChange=[];_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){Xe(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){return!e&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=Gr(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=Yr(this._rawAsyncValidators)}},Ge=class extends We{constructor(e,t,i){super(Mo(t),So(i,t)),this.controls=e,this._initObservables(),this._setUpdateStrategy(t),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(e,t){return this.controls[e]?this.controls[e]:(this.controls[e]=t,t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange),t)}addControl(e,t,i={}){this.registerControl(e,t),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(e,t={}){this.controls[e]&&this.controls[e]._registerOnCollectionChange(()=>{}),delete this.controls[e],this.updateValueAndValidity({emitEvent:t.emitEvent}),this._onCollectionChange()}setControl(e,t,i={}){this.controls[e]&&this.controls[e]._registerOnCollectionChange(()=>{}),delete this.controls[e],t&&this.registerControl(e,t),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(e){return this.controls.hasOwnProperty(e)&&this.controls[e].enabled}setValue(e,t={}){Xr(this,!0,e),Object.keys(e).forEach(i=>{$r(this,!0,i),this.controls[i].setValue(e[i],{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t)}patchValue(e,t={}){e!=null&&(Object.keys(e).forEach(i=>{let o=this.controls[i];o&&o.patchValue(e[i],{onlySelf:!0,emitEvent:t.emitEvent})}),this.updateValueAndValidity(t))}reset(e={},t={}){this._forEachChild((i,o)=>{i.reset(e?e[o]:null,V(f({},t),{onlySelf:!0}))}),this._updatePristine(t,this),this._updateTouched(t,this),this.updateValueAndValidity(t),t?.emitEvent!==!1&&this._events.next(new Ue(this))}getRawValue(){return this._reduceChildren({},(e,t,i)=>(e[i]=t.getRawValue(),e))}_syncPendingControls(){let e=this._reduceChildren(!1,(t,i)=>i._syncPendingControls()?!0:t);return e&&this.updateValueAndValidity({onlySelf:!0}),e}_forEachChild(e){Object.keys(this.controls).forEach(t=>{let i=this.controls[t];i&&e(i,t)})}_setUpControls(){this._forEachChild(e=>{e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(e){for(let[t,i]of Object.entries(this.controls))if(this.contains(t)&&e(i))return!0;return!1}_reduceValue(){let e={};return this._reduceChildren(e,(t,i,o)=>((i.enabled||this.disabled)&&(t[o]=i.value),t))}_reduceChildren(e,t){let i=e;return this._forEachChild((o,r)=>{i=t(i,o,r)}),i}_allControlsDisabled(){for(let e of Object.keys(this.controls))if(this.controls[e].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(e){return this.controls.hasOwnProperty(e)?this.controls[e]:null}};var Nn=new g("",{factory:()=>Ln}),Ln="always";function Zr(n,e){return[...e.path,n]}function Oo(n,e,t=Ln){ko(n,e),e.valueAccessor.writeValue(n.value),(n.disabled||t==="always")&&e.valueAccessor.setDisabledState?.(n.disabled),qr(n,e),Jr(n,e),Qr(n,e),Kr(n,e)}function fo(n,e){n.forEach(t=>{t.registerOnValidatorChange&&t.registerOnValidatorChange(e)})}function Kr(n,e){if(e.valueAccessor.setDisabledState){let t=i=>{e.valueAccessor.setDisabledState(i)};n.registerOnDisabledChange(t),e._registerOnDestroy(()=>{n._unregisterOnDisabledChange(t)})}}function ko(n,e){let t=Ur(n);e.validator!==null?n.setValidators(uo(t,e.validator)):typeof t=="function"&&n.setValidators([t]);let i=Wr(n);e.asyncValidator!==null?n.setAsyncValidators(uo(i,e.asyncValidator)):typeof i=="function"&&n.setAsyncValidators([i]);let o=()=>n.updateValueAndValidity();fo(e._rawValidators,o),fo(e._rawAsyncValidators,o)}function qr(n,e){e.valueAccessor.registerOnChange(t=>{n._pendingValue=t,n._pendingChange=!0,n._pendingDirty=!0,n.updateOn==="change"&&Ro(n,e)})}function Qr(n,e){e.valueAccessor.registerOnTouched(()=>{n._pendingTouched=!0,n.updateOn==="blur"&&n._pendingChange&&Ro(n,e),n.updateOn!=="submit"&&n.markAsTouched()})}function Ro(n,e){n._pendingDirty&&n.markAsDirty(),n.setValue(n._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(n._pendingValue),n._pendingChange=!1}function Jr(n,e){let t=(i,o)=>{e.valueAccessor.writeValue(i),o&&e.viewToModelUpdate(i)};n.registerOnChange(t),e._registerOnDestroy(()=>{n._unregisterOnChange(t)})}function ta(n,e){n==null,ko(n,e)}function ea(n,e){if(!n.hasOwnProperty("model"))return!1;let t=n.model;return t.isFirstChange()?!0:!Object.is(e,t.currentValue)}function na(n){return Object.getPrototypeOf(n.constructor)===Ye}function ia(n,e){n._syncPendingControls(),e.forEach(t=>{let i=t.control;i.updateOn==="submit"&&i._pendingChange&&(t.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function oa(n,e){if(!e)return null;Array.isArray(e);let t,i,o;return e.forEach(r=>{r.constructor===yo?t=r:na(r)?i=r:o=r}),o||i||t||null}var ra={provide:Vt,useExisting:$(()=>aa)},ie=Promise.resolve(),aa=(()=>{class n extends Vt{callSetDisabledState;get submitted(){return et(this.submittedReactive)}_submitted=zt(()=>this.submittedReactive());submittedReactive=X(!1);_directives=new Set;form;ngSubmit=new T;options;constructor(t,i,o){super(),this.callSetDisabledState=o,this.form=new Ge({},Vn(t),Pn(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(t){ie.then(()=>{let i=this._findContainer(t.path);t.control=i.registerControl(t.name,t.control),Oo(t.control,t,this.callSetDisabledState),t.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(t)})}getControl(t){return this.form.get(t.path)}removeControl(t){ie.then(()=>{this._findContainer(t.path)?.removeControl(t.name),this._directives.delete(t)})}addFormGroup(t){ie.then(()=>{let i=this._findContainer(t.path),o=new Ge({});ta(o,t),i.registerControl(t.name,o),o.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(t){ie.then(()=>{this._findContainer(t.path)?.removeControl?.(t.name)})}getFormGroup(t){return this.form.get(t.path)}updateModel(t,i){ie.then(()=>{this.form.get(t.path).setValue(i)})}setValue(t){this.control.setValue(t)}onSubmit(t){return this.submittedReactive.set(!0),ia(this.form,this._directives),this.ngSubmit.emit(t),this.form._events.next(new Tn(this.control)),t?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(t=void 0){this.form.reset(t),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(t){return t.pop(),t.length?this.form.get(t):this.form}static \u0275fac=function(i){return new(i||n)(E($e,10),E(Co,10),E(Nn,8))};static \u0275dir=m({type:n,selectors:[["form",3,"ngNoForm","",3,"formGroup","",3,"formArray",""],["ng-form"],["","ngForm",""]],hostBindings:function(i,o){i&1&&K("submit",function(a){return o.onSubmit(a)})("reset",function(){return o.onReset()})},inputs:{options:[0,"ngFormOptions","options"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[U([ra]),D]})}return n})();function po(n,e){let t=n.indexOf(e);t>-1&&n.splice(t,1)}function go(n){return typeof n=="object"&&n!==null&&Object.keys(n).length===2&&"value"in n&&"disabled"in n}var sa=class extends We{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(e=null,t,i){super(Mo(t),So(i,t)),this._applyFormState(e),this._setUpdateStrategy(t),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Xe(t)&&(t.nonNullable||t.initialValueIsDefault)&&(go(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,t={}){this.value=this._pendingValue=e,this._onChange.length&&t.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,t.emitViewToModelChange!==!1)),this.updateValueAndValidity(t)}patchValue(e,t={}){this.setValue(e,t)}reset(e=this.defaultValue,t={}){this._applyFormState(e),this.markAsPristine(t),this.markAsUntouched(t),this.setValue(this.value,t),t.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,t?.emitEvent!==!1&&this._events.next(new Ue(this))}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){po(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){po(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){go(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var la={provide:ae,useExisting:$(()=>ca)},_o=Promise.resolve(),ca=(()=>{class n extends ae{_changeDetectorRef;callSetDisabledState;control=new sa;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new T;constructor(t,i,o,r,a,l){super(),this._changeDetectorRef=a,this.callSetDisabledState=l,this._parent=t,this._setValidators(i),this._setAsyncValidators(o),this.valueAccessor=oa(this,r)}ngOnChanges(t){if(this._checkForErrors(),!this._registered||"name"in t){if(this._registered&&(this._checkName(),this.formDirective)){let i=t.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in t&&this._updateDisabled(t),ea(t,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){Oo(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(t){_o.then(()=>{this.control.setValue(t,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(t){let i=t.isDisabled.currentValue,o=i!==0&&W(i);_o.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(t){return this._parent?Zr(t,this._parent):[t]}static \u0275fac=function(i){return new(i||n)(E(Vt,9),E($e,10),E(Co,10),E(se,10),E(wt,8),E(Nn,8))};static \u0275dir=m({type:n,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[U([la]),D,it]})}return n})();var Dd=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return n})(),da={provide:se,useExisting:$(()=>ua),multi:!0},ua=(()=>{class n extends Ye{writeValue(t){let i=t??"";this.setProperty("value",i)}registerOnChange(t){this.onChange=i=>{t(i==""?null:parseFloat(i))}}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["input","type","number","formControlName",""],["input","type","number","formControl",""],["input","type","number","ngModel",""]],hostBindings:function(i,o){i&1&&K("input",function(a){return o.onChange(a.target.value)})("blur",function(){return o.onTouched()})},standalone:!1,features:[U([da]),D]})}return n})();var ha={provide:se,useExisting:$(()=>Fo),multi:!0};function Io(n,e){return n==null?`${e}`:(e&&typeof e=="object"&&(e="Object"),`${n}: ${e}`.slice(0,50))}function ma(n){return n.split(":")[0]}var Fo=(()=>{class n extends Ye{value;_optionMap=new Map;_idCounter=0;set compareWith(t){this._compareWith=t}_compareWith=Object.is;appRefInjector=s(lt).injector;destroyRef=s(en);cdr=s(wt);_queuedWrite=!1;_writeValueAfterRender(){this._queuedWrite||this.appRefInjector.destroyed||(this._queuedWrite=!0,Z({write:()=>{this.destroyRef.destroyed||(this._queuedWrite=!1,this.writeValue(this.value))}},{injector:this.appRefInjector}))}writeValue(t){this.cdr.markForCheck(),this.value=t;let i=this._getOptionId(t),o=Io(i,t);this.setProperty("value",o)}registerOnChange(t){this.onChange=i=>{this.value=this._getOptionValue(i),t(this.value)}}_registerOption(){return(this._idCounter++).toString()}_getOptionId(t){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i),t))return i;return null}_getOptionValue(t){let i=ma(t);return this._optionMap.has(i)?this._optionMap.get(i):t}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["select","formControlName","",3,"multiple",""],["select","formControl","",3,"multiple",""],["select","ngModel","",3,"multiple",""]],hostBindings:function(i,o){i&1&&K("change",function(a){return o.onChange(a.target.value)})("blur",function(){return o.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[U([ha]),D]})}return n})(),Ed=(()=>{class n{_element;_renderer;_select;id;constructor(t,i,o){this._element=t,this._renderer=i,this._select=o,this._select&&(this.id=this._select._registerOption())}set ngValue(t){this._select!=null&&(this._select._optionMap.set(this.id,t),this._setElementValue(Io(this.id,t)),this._select._writeValueAfterRender())}set value(t){this._setElementValue(t),this._select?._writeValueAfterRender()}_setElementValue(t){this._renderer.setProperty(this._element.nativeElement,"value",t)}ngOnDestroy(){this._select?._optionMap.delete(this.id),this._select?._writeValueAfterRender()}static \u0275fac=function(i){return new(i||n)(E(C),E(L),E(Fo,9))};static \u0275dir=m({type:n,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return n})(),fa={provide:se,useExisting:$(()=>To),multi:!0};function bo(n,e){return n==null?`${e}`:(typeof e=="string"&&(e=`'${e}'`),e&&typeof e=="object"&&(e="Object"),`${n}: ${e}`.slice(0,50))}function pa(n){return n.split(":")[0]}var To=(()=>{class n extends Ye{value;_optionMap=new Map;_idCounter=0;set compareWith(t){this._compareWith=t}_compareWith=Object.is;writeValue(t){this.value=t;let i;if(Array.isArray(t)){let o=t.map(r=>this._getOptionId(r));i=(r,a)=>{r._setSelected(o.indexOf(a)>-1)}}else i=o=>{o._setSelected(!1)};this._optionMap.forEach(i)}registerOnChange(t){this.onChange=i=>{let o=[],r=i.selectedOptions;if(r!==void 0){let a=r;for(let l=0;l<a.length;l++){let c=a[l],u=this._getOptionValue(c.value);o.push(u)}}else{let a=i.options;for(let l=0;l<a.length;l++){let c=a[l];if(c.selected){let u=this._getOptionValue(c.value);o.push(u)}}}this.value=o,t(o)}}_registerOption(t){let i=(this._idCounter++).toString();return this._optionMap.set(i,t),i}_getOptionId(t){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i)._value,t))return i;return null}_getOptionValue(t){let i=pa(t);return this._optionMap.has(i)?this._optionMap.get(i)._value:t}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["select","multiple","","formControlName",""],["select","multiple","","formControl",""],["select","multiple","","ngModel",""]],hostBindings:function(i,o){i&1&&K("change",function(a){return o.onChange(a.target)})("blur",function(){return o.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[U([fa]),D]})}return n})(),xd=(()=>{class n{_element;_renderer;_select;id;_value;constructor(t,i,o){this._element=t,this._renderer=i,this._select=o,this._select&&(this.id=this._select._registerOption(this))}set ngValue(t){this._select!=null&&(this._value=t,this._setElementValue(bo(this.id,t)),this._select.writeValue(this._select.value))}set value(t){this._select?(this._value=t,this._setElementValue(bo(this.id,t)),this._select.writeValue(this._select.value)):this._setElementValue(t)}_setElementValue(t){this._renderer.setProperty(this._element.nativeElement,"value",t)}_setSelected(t){this._renderer.setProperty(this._element.nativeElement,"selected",t)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static \u0275fac=function(i){return new(i||n)(E(C),E(L),E(To,9))};static \u0275dir=m({type:n,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return n})();function ga(n){return typeof n=="number"?n:parseFloat(n)}var Vo=(()=>{class n{_validator=co;_onChange;_enabled;ngOnChanges(t){if(this.inputName in t){let i=this.normalizeInput(t[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):co,this._onChange?.()}}validate(t){return this._validator(t)}registerOnValidatorChange(t){this._onChange=t}enabled(t){return t!=null}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,features:[it]})}return n})();var _a={provide:$e,useExisting:$(()=>ba),multi:!0},ba=(()=>{class n extends Vo{min;inputName="min";normalizeInput=t=>ga(t);createValidator=t=>Lr(t);static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["input","type","number","min","","formControlName",""],["input","type","number","min","","formControl",""],["input","type","number","min","","ngModel",""]],hostVars:1,hostBindings:function(i,o){i&2&&H("min",o._enabled?o.min:null)},inputs:{min:"min"},standalone:!1,features:[U([_a]),D]})}return n})(),va={provide:$e,useExisting:$(()=>ya),multi:!0};var ya=(()=>{class n extends Vo{required;inputName="required";normalizeInput=W;createValidator=t=>Br;enabled(t){return t}static \u0275fac=(()=>{let t;return function(o){return(t||(t=P(n)))(o||n)}})();static \u0275dir=m({type:n,selectors:[["","required","","formControlName","",3,"type","checkbox"],["","required","","formControl","",3,"type","checkbox"],["","required","","ngModel","",3,"type","checkbox"]],hostVars:1,hostBindings:function(i,o){i&2&&H("required",o._enabled?"":null)},inputs:{required:"required"},standalone:!1,features:[U([va]),D]})}return n})();var Ca=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({})}return n})();var Ad=(()=>{class n{static withConfig(t){return{ngModule:n,providers:[{provide:Nn,useValue:t.callSetDisabledState??Ln}]}}static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({imports:[Ca]})}return n})();var j=(function(n){return n[n.FADING_IN=0]="FADING_IN",n[n.VISIBLE=1]="VISIBLE",n[n.FADING_OUT=2]="FADING_OUT",n[n.HIDDEN=3]="HIDDEN",n})(j||{}),Bn=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=j.HIDDEN;constructor(e,t,i,o=!1){this._renderer=e,this.element=t,this.config=i,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},Po=It({passive:!0,capture:!0}),jn=class{_events=new Map;addHandler(e,t,i,o){let r=this._events.get(t);if(r){let a=r.get(i);a?a.add(o):r.set(i,new Set([o]))}else this._events.set(t,new Map([[i,new Set([o])]])),e.runOutsideAngular(()=>{document.addEventListener(t,this._delegateEventHandler,Po)})}removeHandler(e,t,i){let o=this._events.get(e);if(!o)return;let r=o.get(t);r&&(r.delete(i),r.size===0&&o.delete(t),o.size===0&&(this._events.delete(e),document.removeEventListener(e,this._delegateEventHandler,Po)))}_delegateEventHandler=e=>{let t=N(e);t&&this._events.get(e.type)?.forEach((i,o)=>{(o===t||o.contains(t))&&i.forEach(r=>r.handleEvent(e))})}},le={enterDuration:225,exitDuration:150},wa=800,No=It({passive:!0,capture:!0}),Lo=["mousedown","touchstart"],Bo=["mouseup","mouseleave","touchend","touchcancel"],Da=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(i,o){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return n})(),Ze=class n{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new jn;constructor(e,t,i,o,r){this._target=e,this._ngZone=t,this._platform=o,o.isBrowser&&(this._containerElement=Q(i)),r&&r.get(q).load(Da)}fadeInRipple(e,t,i={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=f(f({},le),i.animation);i.centered&&(e=o.left+o.width/2,t=o.top+o.height/2);let a=i.radius||Ea(e,t,o),l=e-o.left,c=t-o.top,u=r.enterDuration,d=document.createElement("div");d.classList.add("mat-ripple-element"),d.style.left=`${l-a}px`,d.style.top=`${c-a}px`,d.style.height=`${a*2}px`,d.style.width=`${a*2}px`,i.color!=null&&(d.style.backgroundColor=i.color),d.style.transitionDuration=`${u}ms`,this._containerElement.appendChild(d);let p=window.getComputedStyle(d),I=p.transitionProperty,F=p.transitionDuration,R=I==="none"||F==="0s"||F==="0s, 0s"||o.width===0&&o.height===0,O=new Bn(this,d,i,R);d.style.transform="scale3d(1, 1, 1)",O.state=j.FADING_IN,i.persistent||(this._mostRecentTransientRipple=O);let at=null;return!R&&(u||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let Wn=()=>{at&&(at.fallbackTimer=null),clearTimeout(Gn),this._finishRippleTransition(O)},qe=()=>this._destroyRipple(O),Gn=setTimeout(qe,u+100);d.addEventListener("transitionend",Wn),d.addEventListener("transitioncancel",qe),at={onTransitionEnd:Wn,onTransitionCancel:qe,fallbackTimer:Gn}}),this._activeRipples.set(O,at),(R||!u)&&this._finishRippleTransition(O),O}fadeOutRipple(e){if(e.state===j.FADING_OUT||e.state===j.HIDDEN)return;let t=e.element,i=f(f({},le),e.config.animation);t.style.transitionDuration=`${i.exitDuration}ms`,t.style.opacity="0",e.state=j.FADING_OUT,(e._animationForciblyDisabledThroughCss||!i.exitDuration)&&this._finishRippleTransition(e)}fadeOutAll(){this._getActiveRipples().forEach(e=>e.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(e=>{e.config.persistent||e.fadeOut()})}setupTriggerEvents(e){let t=Q(e);!this._platform.isBrowser||!t||t===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=t,Lo.forEach(i=>{n._eventManager.addHandler(this._ngZone,i,t,this)}))}handleEvent(e){e.type==="mousedown"?this._onMousedown(e):e.type==="touchstart"?this._onTouchStart(e):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Bo.forEach(t=>{this._triggerElement.addEventListener(t,this,No)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(e){e.state===j.FADING_IN?this._startFadeOutTransition(e):e.state===j.FADING_OUT&&this._destroyRipple(e)}_startFadeOutTransition(e){let t=e===this._mostRecentTransientRipple,{persistent:i}=e.config;e.state=j.VISIBLE,!i&&(!t||!this._isPointerDown)&&e.fadeOut()}_destroyRipple(e){let t=this._activeRipples.get(e)??null;this._activeRipples.delete(e),this._activeRipples.size||(this._containerRect=null),e===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),e.state=j.HIDDEN,t!==null&&(e.element.removeEventListener("transitionend",t.onTransitionEnd),e.element.removeEventListener("transitioncancel",t.onTransitionCancel),t.fallbackTimer!==null&&clearTimeout(t.fallbackTimer)),e.element.remove()}_onMousedown(e){let t=Zt(e),i=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+wa;!this._target.rippleDisabled&&!t&&!i&&(this._isPointerDown=!0,this.fadeInRipple(e.clientX,e.clientY,this._target.rippleConfig))}_onTouchStart(e){if(!this._target.rippleDisabled&&!Kt(e)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let t=e.changedTouches;if(t)for(let i=0;i<t.length;i++)this.fadeInRipple(t[i].clientX,t[i].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(e=>{let t=e.state===j.VISIBLE||e.config.terminateOnPointerUp&&e.state===j.FADING_IN;!e.config.persistent&&t&&e.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let e=this._triggerElement;e&&(Lo.forEach(t=>n._eventManager.removeHandler(t,e,this)),this._pointerUpEventsRegistered&&(Bo.forEach(t=>e.removeEventListener(t,this,No)),this._pointerUpEventsRegistered=!1))}};function Ea(n,e,t){let i=Math.max(Math.abs(n-t.left),Math.abs(n-t.right)),o=Math.max(Math.abs(e-t.top),Math.abs(e-t.bottom));return Math.sqrt(i*i+o*o)}var jo=new g("mat-ripple-global-options");var xa={capture:!0},Aa=["focus","mousedown","mouseenter","touchstart"],zn="mat-ripple-loader-uninitialized",Hn="mat-ripple-loader-class-name",zo="mat-ripple-loader-centered",Ke="mat-ripple-loader-disabled",Ho=(()=>{class n{_document=s(x);_animationsDisabled=_t();_globalRippleOptions=s(jo,{optional:!0});_platform=s(M);_ngZone=s(y);_injector=s(v);_eventCleanups;_hosts=new Map;constructor(){let t=s(z).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>Aa.map(i=>t.listen(this._document,i,this._onInteraction,xa)))}ngOnDestroy(){let t=this._hosts.keys();for(let i of t)this.destroyRipple(i);this._eventCleanups.forEach(i=>i())}configureRipple(t,i){t.setAttribute(zn,this._globalRippleOptions?.namespace??""),(i.className||!t.hasAttribute(Hn))&&t.setAttribute(Hn,i.className||""),i.centered&&t.setAttribute(zo,""),i.disabled&&t.setAttribute(Ke,"")}setDisabled(t,i){let o=this._hosts.get(t);o?(o.target.rippleDisabled=i,!i&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(t))):i?t.setAttribute(Ke,""):t.removeAttribute(Ke)}_onInteraction=t=>{let i=N(t);if(i instanceof HTMLElement){let o=i.closest(`[${zn}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(t){if(!this._document||this._hosts.has(t))return;t.querySelector(".mat-ripple")?.remove();let i=this._document.createElement("span");i.classList.add("mat-ripple",t.getAttribute(Hn)),t.append(i);let o=this._globalRippleOptions,r=this._animationsDisabled?0:o?.animation?.enterDuration??le.enterDuration,a=this._animationsDisabled?0:o?.animation?.exitDuration??le.exitDuration,l={rippleDisabled:this._animationsDisabled||o?.disabled||t.hasAttribute(Ke),rippleConfig:{centered:t.hasAttribute(zo),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:r,exitDuration:a}}},c=new Ze(l,this._ngZone,i,this._platform,this._injector),u=!l.rippleDisabled;u&&c.setupTriggerEvents(t),this._hosts.set(t,{target:l,renderer:c,hasSetUpEvents:u}),t.removeAttribute(zn)}destroyRipple(t){let i=this._hosts.get(t);i&&(i.renderer._removeTriggerEvents(),this._hosts.delete(t))}static \u0275fac=function(i){return new(i||n)};static \u0275prov=h({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var Uo=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["structural-styles"]],decls:0,vars:0,template:function(i,o){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
  }
}
`],encapsulation:2,changeDetection:0})}return n})();var Ma=new g("MAT_BUTTON_CONFIG");function Wo(n){return n==null?void 0:si(n)}var Go=(()=>{class n{_elementRef=s(C);_ngZone=s(y);_animationsDisabled=_t();_config=s(Ma,{optional:!0});_focusMonitor=s(Jt);_cleanupClick;_renderer=s(L);_rippleLoader=s(Ho);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=t,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(t){this.tabIndex=t}constructor(){s(q).load(Uo);let t=this._elementRef.nativeElement;this._isAnchor=t.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(t,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(t="program",i){t?this._focusMonitor.focusVia(this._elementRef.nativeElement,t,i):this._elementRef.nativeElement.focus(i)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}))}static \u0275fac=function(i){return new(i||n)};static \u0275dir=m({type:n,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(i,o){i&2&&(H("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),ri(o.color?"mat-"+o.color:""),B("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",W],disabled:[2,"disabled","disabled",W],ariaDisabled:[2,"aria-disabled","ariaDisabled",W],disabledInteractive:[2,"disabledInteractive","disabledInteractive",W],tabIndex:[2,"tabIndex","tabIndex",Wo],_tabindex:[2,"tabindex","_tabindex",Wo]}})}return n})();var Yo=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({imports:[Y]})}return n})();var Sa=["matButton",""],Oa=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],ka=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var $o=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),Xo=(()=>{class n extends Go{get appearance(){return this._appearance}set appearance(t){this.setAppearance(t||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let t=Ra(this._elementRef.nativeElement);t&&this.setAppearance(t)}setAppearance(t){if(t===this._appearance)return;let i=this._elementRef.nativeElement.classList,o=this._appearance?$o.get(this._appearance):null,r=$o.get(t);o&&i.remove(...o),i.add(...r),this._appearance=t}static \u0275fac=function(i){return new(i||n)};static \u0275cmp=k({type:n,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[D],attrs:Sa,ngContentSelectors:ka,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,o){i&1&&(be(Oa),Bt(0,"span",0),Ct(1),on(2,"span",1),Ct(3,1),rn(),Ct(4,2),Bt(5,"span",2)(6,"span",3)),i&2&&B("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab)},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--mat-button-text-horizontal-padding, 12px);
  height: var(--mat-button-text-container-height, 40px);
  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-text-label-text-transform);
  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-text-touch-target-size, 48px);
  display: var(--mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-filled-container-height, 40px);
  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-filled-label-text-transform);
  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-filled-touch-target-size, 48px);
  display: var(--mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));
  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));
  height: var(--mat-button-protected-container-height, 40px);
  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-protected-label-text-transform);
  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-protected-touch-target-size, 48px);
  display: var(--mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));
  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-outlined-container-height, 40px);
  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-outlined-label-text-transform);
  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));
  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));
  border-width: var(--mat-button-outlined-outline-width, 1px);
  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-outlined-touch-target-size, 48px);
  display: var(--mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));
  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-tonal-container-height, 40px);
  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-tonal-label-text-transform);
  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-tonal-touch-target-size, 48px);
  display: var(--mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return n})();function Ra(n){return n.hasAttribute("mat-raised-button")?"elevated":n.hasAttribute("mat-stroked-button")?"outlined":n.hasAttribute("mat-flat-button")?"filled":n.hasAttribute("mat-button")?"text":null}var Zo=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=w({type:n});static \u0275inj=b({imports:[Yo,Y]})}return n})();var Un={title:"Auswahl treffen",message:"M\xF6chten Sie diese Aktion wirklich ausf\xFChren?",confirmLabel:"Best\xE4tigen"},Ko=class n{dialogRef=s(bt);data=s(Rn,{optional:!0})??{};title=this.data.title??Un.title;message=this.data.message??Un.message;confirmLabel=this.data.confirmLabel??Un.confirmLabel;onNoClick(){this.dialogRef.close(!1)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=k({type:n,selectors:[["app-confirmation-dialog"]],hostAttrs:[1,"general-dialog"],decls:9,vars:4,consts:[["mat-dialog-title","",1,"general-dialog__title"],["align","end"],["mat-button","",1,"general-dialog__cancel",3,"click"],["mat-flat-button","",1,"general-dialog__confirm",3,"mat-dialog-close"]],template:function(t,i){t&1&&(ct(0,"h2",0),jt(1),dt(),ct(2,"mat-dialog-content"),jt(3),dt(),ct(4,"mat-dialog-actions",1)(5,"button",2),K("click",function(){return i.onNoClick()}),jt(6,"Abbrechen"),dt(),ct(7,"button",3),jt(8),dt()()),t&2&&(yt(),dn(i.title),yt(2),dn(i.message),yt(4),oi("mat-dialog-close",!0),yt(),ai(" ",i.confirmLabel," "))},dependencies:[lo,no,oo,ao,ro,Zo,Xo],encapsulation:2})};export{fn as a,N as b,q as c,Ut as d,Q as e,ut as f,Wt as g,Zt as h,Kt as i,bt as j,Rn as k,In as l,oo as m,ro as n,ao as o,lo as p,yo as q,yd as r,Cd as s,aa as t,ca as u,Dd as v,ua as w,Fo as x,Ed as y,xd as z,ba as A,ya as B,Ad as C,Xo as D,Zo as E,Ko as F};
