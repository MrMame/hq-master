import{a as Me}from"./chunk-PGUV37MU.js";import"./chunk-BTY2PIJ6.js";import"./chunk-4KAYFB37.js";import{a as K,b as yn,c as Ht,d as U,e as Ut,f as zt,g as Ee,h as rt,i as V,j as Gt,k as wi,l as at,m as Cn,n as xi,o as Wt,p as Dn,q as st,r as xt,s as Ei,t as Mi,x as Ai}from"./chunk-HHMJQEZG.js";import{a as vn,e as Di}from"./chunk-SQFD3SOJ.js";import{$ as H,$a as ye,Ab as we,Bb as _i,C as ce,Ca as nt,D as et,Da as fe,E as ai,Ea as it,Eb as q,Fa as J,Fb as jt,Ga as z,Ha as hn,I as yt,Ia as pn,J as Ct,Kb as vi,L as de,La as C,Lb as xe,Ma as T,Na as E,Oa as ci,Ob as tt,P as ue,Pa as B,Pb as yi,Q as g,Qa as ge,Qb as Ci,R as S,Sa as di,T as v,Ua as fn,V as s,Va as mt,Wa as be,Xa as _e,Y as me,Za as ui,_ as j,_a as ve,a as p,aa as y,ab as X,b as R,ba as P,bb as u,c as dn,ca as mn,cb as h,db as Z,e as un,ea as G,eb as mi,f as D,fa as O,fb as hi,g as Jn,gb as Ce,h as Vt,hb as ot,ib as gn,ja as Q,jb as _,k as ti,ka as si,l as ei,la as Lt,lb as M,ma as Y,mb as bn,nb as Bt,oa as L,p as Nt,pb as pi,q as ni,qb as fi,rb as gi,sb as bi,t as ii,ta as he,tb as W,u as le,ua as li,ub as De,v as oi,vb as b,wa as pe,wb as Dt,x as ri,xb as wt,y as ut,ya as x,zb as _n}from"./chunk-6IUPFT53.js";var Pi=(()=>{class i{_renderer;_elementRef;onChange=t=>{};onTouched=()=>{};constructor(t,n){this._renderer=t,this._elementRef=n}setProperty(t,n){this._renderer.setProperty(this._elementRef.nativeElement,t,n)}registerOnTouched(t){this.onTouched=t}registerOnChange(t){this.onChange=t}setDisabledState(t){this.setProperty("disabled",t)}static \u0275fac=function(n){return new(n||i)(z(J),z(L))};static \u0275dir=E({type:i})}return i})(),Vi=(()=>{class i extends Pi{static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275dir=E({type:i,features:[B]})}return i})(),kn=new v("");var tr={provide:kn,useExisting:ue(()=>Se),multi:!0};function er(){let i=vn()?vn().getUserAgent():"";return/android (\d+)/.test(i.toLowerCase())}var nr=new v(""),Se=(()=>{class i extends Pi{_compositionMode;_composing=!1;constructor(t,n,o){super(t,n),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!er())}writeValue(t){let n=t??"";this.setProperty("value",n)}_handleInput(t){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(t)}_compositionStart(){this._composing=!0}_compositionEnd(t){this._composing=!1,this._compositionMode&&this.onChange(t)}static \u0275fac=function(n){return new(n||i)(z(J),z(L),z(nr,8))};static \u0275dir=E({type:i,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(n,o){n&1&&_("input",function(a){return o._handleInput(a.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(a){return o._compositionEnd(a.target.value)})},standalone:!1,features:[we([tr]),B]})}return i})();var ir=new v(""),or=new v("");function Ni(i){return i!=null}function Li(i){return di(i)?ti(i):i}function Bi(i){let e={};return i.forEach(t=>{e=t!=null?p(p({},e),t):e}),Object.keys(e).length===0?null:e}function ji(i,e){return e.map(t=>t(i))}function rr(i){return!i.validate}function Hi(i){return i.map(e=>rr(e)?e:t=>e.validate(t))}function ar(i){if(!i)return null;let e=i.filter(Ni);return e.length==0?null:function(t){return Bi(ji(t,e))}}function Ui(i){return i!=null?ar(Hi(i)):null}function sr(i){if(!i)return null;let e=i.filter(Ni);return e.length==0?null:function(t){let n=ji(t,e).map(Li);return oi(n).pipe(Nt(Bi))}}function zi(i){return i!=null?sr(Hi(i)):null}function ki(i,e){return i===null?[e]:Array.isArray(i)?[...i,e]:[i,e]}function lr(i){return i._rawValidators}function cr(i){return i._rawAsyncValidators}function wn(i){return i?Array.isArray(i)?i:[i]:[]}function ke(i,e){return Array.isArray(i)?i.includes(e):i===e}function Oi(i,e){let t=wn(e);return wn(i).forEach(o=>{ke(t,o)||t.push(o)}),t}function Ii(i,e){return wn(e).filter(t=>!ke(i,t))}var Oe=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=Ui(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=zi(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control?.reset(e)}hasError(e,t){return this.control?this.control.hasError(e,t):!1}getError(e,t){return this.control?this.control.getError(e,t):null}},xn=class extends Oe{name;get formDirective(){return null}get path(){return null}},qt=class extends Oe{_parent=null;name=null;valueAccessor=null},En=class{_cd;constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Gi=(()=>{class i extends En{constructor(t){super(t)}static \u0275fac=function(n){return new(n||i)(z(qt,2))};static \u0275dir=E({type:i,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(n,o){n&2&&W("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[B]})}return i})();var $t="VALID",Ae="INVALID",Et="PENDING",Yt="DISABLED",ht=class{},Ie=class extends ht{value;source;constructor(e,t){super(),this.value=e,this.source=t}},Xt=class extends ht{pristine;source;constructor(e,t){super(),this.pristine=e,this.source=t}},Zt=class extends ht{touched;source;constructor(e,t){super(),this.touched=e,this.source=t}},Mt=class extends ht{status;source;constructor(e,t){super(),this.status=e,this.source=t}};var Mn=class extends ht{source;constructor(e){super(),this.source=e}};function dr(i){return(Te(i)?i.validators:i)||null}function ur(i){return Array.isArray(i)?Ui(i):i||null}function mr(i,e){return(Te(e)?e.asyncValidators:i)||null}function hr(i){return Array.isArray(i)?zi(i):i||null}function Te(i){return i!=null&&!Array.isArray(i)&&typeof i=="object"}var An=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(e,t){this._assignValidators(e),this._assignAsyncValidators(t)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return q(this.statusReactive)}set status(e){q(()=>this.statusReactive.set(e))}_status=jt(()=>this.statusReactive());statusReactive=Q(void 0);get valid(){return this.status===$t}get invalid(){return this.status===Ae}get pending(){return this.status===Et}get disabled(){return this.status===Yt}get enabled(){return this.status!==Yt}errors;get pristine(){return q(this.pristineReactive)}set pristine(e){q(()=>this.pristineReactive.set(e))}_pristine=jt(()=>this.pristineReactive());pristineReactive=Q(!0);get dirty(){return!this.pristine}get touched(){return q(this.touchedReactive)}set touched(e){q(()=>this.touchedReactive.set(e))}_touched=jt(()=>this.touchedReactive());touchedReactive=Q(!1);get untouched(){return!this.touched}_events=new D;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(Oi(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(Oi(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(Ii(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(Ii(e,this._rawAsyncValidators))}hasValidator(e){return ke(this._rawValidators,e)}hasAsyncValidator(e){return ke(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let t=this.touched===!1;this.touched=!0;let n=e.sourceControl??this;e.onlySelf||this._parent?.markAsTouched(R(p({},e),{sourceControl:n})),t&&e.emitEvent!==!1&&this._events.next(new Zt(!0,n))}markAllAsDirty(e={}){this.markAsDirty({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsDirty(e))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsTouched(e))}markAsUntouched(e={}){let t=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let n=e.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:n})}),e.onlySelf||this._parent?._updateTouched(e,n),t&&e.emitEvent!==!1&&this._events.next(new Zt(!1,n))}markAsDirty(e={}){let t=this.pristine===!0;this.pristine=!1;let n=e.sourceControl??this;e.onlySelf||this._parent?.markAsDirty(R(p({},e),{sourceControl:n})),t&&e.emitEvent!==!1&&this._events.next(new Xt(!1,n))}markAsPristine(e={}){let t=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let n=e.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),e.onlySelf||this._parent?._updatePristine(e,n),t&&e.emitEvent!==!1&&this._events.next(new Xt(!0,n))}markAsPending(e={}){this.status=Et;let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Mt(this.status,t)),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.markAsPending(R(p({},e),{sourceControl:t}))}disable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=Yt,this.errors=null,this._forEachChild(o=>{o.disable(R(p({},e),{onlySelf:!0}))}),this._updateValue();let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Ie(this.value,n)),this._events.next(new Mt(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(R(p({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=$t,this._forEachChild(n=>{n.enable(R(p({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(R(p({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(n=>n(!1))}_updateAncestors(e,t){e.onlySelf||(this._parent?.updateValueAndValidity(e),e.skipPristineCheck||this._parent?._updatePristine({},t),this._parent?._updateTouched({},t))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let n=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===$t||this.status===Et)&&this._runAsyncValidator(n,e.emitEvent)}let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new Ie(this.value,t)),this._events.next(new Mt(this.status,t)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.updateValueAndValidity(R(p({},e),{sourceControl:t}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(t=>t._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Yt:$t}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,t){if(this.asyncValidator){this.status=Et,this._hasOwnPendingAsyncValidator={emitEvent:t!==!1,shouldHaveEmitted:e!==!1};let n=Li(this.asyncValidator(this));this._asyncValidationSubscription=n.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:t,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,t={}){this.errors=e,this._updateControlsErrors(t.emitEvent!==!1,this,t.shouldHaveEmitted)}get(e){let t=e;return t==null||(Array.isArray(t)||(t=t.split(".")),t.length===0)?null:t.reduce((n,o)=>n&&n._find(o),this)}getError(e,t){let n=t?this.get(t):this;return n?.errors?n.errors[e]:null}hasError(e,t){return!!this.getError(e,t)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,t,n){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||n)&&this._events.next(new Mt(this.status,t)),this._parent&&this._parent._updateControlsErrors(e,t,n)}_initObservables(){this.valueChanges=new G,this.statusChanges=new G}_calculateStatus(){return this._allControlsDisabled()?Yt:this.errors?Ae:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Et)?Et:this._anyControlsHaveStatus(Ae)?Ae:$t}_anyControlsHaveStatus(e){return this._anyControls(t=>t.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,t){let n=!this._anyControlsDirty(),o=this.pristine!==n;this.pristine=n,e.onlySelf||this._parent?._updatePristine(e,t),o&&this._events.next(new Xt(this.pristine,t))}_updateTouched(e={},t){this.touched=this._anyControlsTouched(),this._events.next(new Zt(this.touched,t)),e.onlySelf||this._parent?._updateTouched(e,t)}_onDisabledChange=[];_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){Te(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){return!e&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=ur(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=hr(this._rawAsyncValidators)}};var Wi=new v("",{factory:()=>On}),On="always";function pr(i,e){return[...e.path,i]}function fr(i,e,t=On){br(i,e),e.valueAccessor.writeValue(i.value),(i.disabled||t==="always")&&e.valueAccessor.setDisabledState?.(i.disabled),_r(i,e),yr(i,e),vr(i,e),gr(i,e)}function Si(i,e){i.forEach(t=>{t.registerOnValidatorChange&&t.registerOnValidatorChange(e)})}function gr(i,e){if(e.valueAccessor.setDisabledState){let t=n=>{e.valueAccessor.setDisabledState(n)};i.registerOnDisabledChange(t),e._registerOnDestroy(()=>{i._unregisterOnDisabledChange(t)})}}function br(i,e){let t=lr(i);e.validator!==null?i.setValidators(ki(t,e.validator)):typeof t=="function"&&i.setValidators([t]);let n=cr(i);e.asyncValidator!==null?i.setAsyncValidators(ki(n,e.asyncValidator)):typeof n=="function"&&i.setAsyncValidators([n]);let o=()=>i.updateValueAndValidity();Si(e._rawValidators,o),Si(e._rawAsyncValidators,o)}function _r(i,e){e.valueAccessor.registerOnChange(t=>{i._pendingValue=t,i._pendingChange=!0,i._pendingDirty=!0,i.updateOn==="change"&&$i(i,e)})}function vr(i,e){e.valueAccessor.registerOnTouched(()=>{i._pendingTouched=!0,i.updateOn==="blur"&&i._pendingChange&&$i(i,e),i.updateOn!=="submit"&&i.markAsTouched()})}function $i(i,e){i._pendingDirty&&i.markAsDirty(),i.setValue(i._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1}function yr(i,e){let t=(n,o)=>{e.valueAccessor.writeValue(n),o&&e.viewToModelUpdate(n)};i.registerOnChange(t),e._registerOnDestroy(()=>{i._unregisterOnChange(t)})}function Cr(i,e){if(!i.hasOwnProperty("model"))return!1;let t=i.model;return t.isFirstChange()?!0:!Object.is(e,t.currentValue)}function Dr(i){return Object.getPrototypeOf(i.constructor)===Vi}function wr(i,e){if(!e)return null;Array.isArray(e);let t,n,o;return e.forEach(r=>{r.constructor===Se?t=r:Dr(r)?n=r:o=r}),o||n||t||null}function Ti(i,e){let t=i.indexOf(e);t>-1&&i.splice(t,1)}function Fi(i){return typeof i=="object"&&i!==null&&Object.keys(i).length===2&&"value"in i&&"disabled"in i}var xr=class extends An{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(e=null,t,n){super(dr(t),mr(n,t)),this._applyFormState(e),this._setUpdateStrategy(t),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Te(t)&&(t.nonNullable||t.initialValueIsDefault)&&(Fi(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,t={}){this.value=this._pendingValue=e,this._onChange.length&&t.emitModelToViewChange!==!1&&this._onChange.forEach(n=>n(this.value,t.emitViewToModelChange!==!1)),this.updateValueAndValidity(t)}patchValue(e,t={}){this.setValue(e,t)}reset(e=this.defaultValue,t={}){this._applyFormState(e),this.markAsPristine(t),this.markAsUntouched(t),this.setValue(this.value,t),t.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,t?.emitEvent!==!1&&this._events.next(new Mn(this))}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){Ti(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){Ti(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){Fi(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var Er={provide:qt,useExisting:ue(()=>In)},Ri=Promise.resolve(),In=(()=>{class i extends qt{_changeDetectorRef;callSetDisabledState;control=new xr;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new G;constructor(t,n,o,r,a,l){super(),this._changeDetectorRef=a,this.callSetDisabledState=l,this._parent=t,this._setValidators(n),this._setAsyncValidators(o),this.valueAccessor=wr(this,r)}ngOnChanges(t){if(this._checkForErrors(),!this._registered||"name"in t){if(this._registered&&(this._checkName(),this.formDirective)){let n=t.name.previousValue;this.formDirective.removeControl({name:n,path:this._getPath(n)})}this._setUpControl()}"isDisabled"in t&&this._updateDisabled(t),Cr(t,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){fr(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(t){Ri.then(()=>{this.control.setValue(t,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(t){let n=t.isDisabled.currentValue,o=n!==0&&tt(n);Ri.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(t){return this._parent?pr(t,this._parent):[t]}static \u0275fac=function(n){return new(n||i)(z(xn,9),z(ir,10),z(or,10),z(kn,10),z(xe,8),z(Wi,8))};static \u0275dir=E({type:i,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[we([Er]),B,Lt]})}return i})();var Mr={provide:kn,useExisting:ue(()=>Sn),multi:!0},Sn=(()=>{class i extends Vi{writeValue(t){let n=t??"";this.setProperty("value",n)}registerOnChange(t){this.onChange=n=>{t(n==""?null:parseFloat(n))}}static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275dir=E({type:i,selectors:[["input","type","number","formControlName",""],["input","type","number","formControl",""],["input","type","number","ngModel",""]],hostBindings:function(n,o){n&1&&_("input",function(a){return o.onChange(a.target.value)})("blur",function(){return o.onTouched()})},standalone:!1,features:[we([Mr]),B]})}return i})();var Ar=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({})}return i})();var Yi=(()=>{class i{static withConfig(t){return{ngModule:i,providers:[{provide:Wi,useValue:t.callSetDisabledState??On}]}}static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({imports:[Ar]})}return i})();function Xi(i,e){let t=e?.injector??s(y),n=new Vt(1),o=si(()=>{let r;try{r=i()}catch(a){q(()=>n.error(a));return}q(()=>n.next(r))},{injector:t,manualCleanup:!0});return t.get(mn).onDestroy(()=>{o.destroy(),n.complete()}),n.asObservable()}function Or(i,e){if(i&1){let t=ot();u(0,"div",2),Z(1,"img",3),u(2,"div",4)(3,"span",5),b(4),h()()(),u(5,"div",6)(6,"div",7)(7,"span",8),b(8,"Health:"),h(),u(9,"input",9),_("ngModelChange",function(o){j(t);let r=M();return H(r.updateField("health",o))}),h()(),u(10,"div",7)(11,"span",8),b(12,"Defense:"),h(),u(13,"input",9),_("ngModelChange",function(o){j(t);let r=M();return H(r.updateField("defense",o))}),h()(),u(14,"div",7)(15,"span",8),b(16,"Speed:"),h(),u(17,"input",9),_("ngModelChange",function(o){j(t);let r=M();return H(r.updateField("speed",o))}),h()(),u(18,"div",7)(19,"span",8),b(20,"Attack:"),h(),u(21,"input",9),_("ngModelChange",function(o){j(t);let r=M();return H(r.updateField("attack",o))}),h()()(),u(22,"div",10)(23,"h3",5),b(24,"Abilities:"),h(),u(25,"span",8),b(26),h()(),u(27,"div",10)(28,"p",11),b(29),h()()}if(i&2){let t=e;x(),X("src",t.image,pe),x(3),wt("Type: ",t.type),x(5),X("ngModel",t.health),x(4),X("ngModel",t.defense),x(4),X("ngModel",t.speed),x(4),X("ngModel",t.attack),x(5),Dt(t.abilities.join(", ")),x(3),Dt(t.description)}}var Fe=class i{charactersDbService=s(Me);characterInfo=vi();subscription;constructor(){this.subscription=Xi(this.characterInfo).pipe(yt(1),ce(300)).subscribe(e=>{e&&this.charactersDbService.writeCharacter(e)})}ngOnDestroy(){this.subscription.unsubscribe()}updateField(e,t){this.characterInfo.update(n=>n&&R(p({},n),{[e]:t}))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=C({type:i,selectors:[["app-character-card"]],inputs:{characterInfo:[1,"characterInfo"]},outputs:{characterInfo:"characterInfoChange"},decls:5,vars:1,consts:[[1,"bg-yellow-500","shadow-md","rounded-lg","p-0.5","h-[30vh]","overflow-scroll","text-xs"],[1,"bg-blue-500","text-white","px-4","py-2","rounded","hover:bg-blue-600"],[1,"flex","mb-1"],["alt","Monster Image",1,"w-[30%]","h-auto","object-cover","mb-2","rounded",3,"src"],[1,"flex-col","ml-3"],[1,"text-gray-600"],[1,"ml-3"],[1,"flex"],[1,"basis-1/3","text-gray-600"],["type","number",1,"border","p-1","rounded","w-20","mb-0.5",3,"ngModelChange","ngModel"],[1,"flex-col","m-3"],[1,"basis-2/3","text-gray-700","mb-4"]],template:function(t,n){if(t&1&&(u(0,"div",0),be(1,Or,30,8),Z(2,"br"),u(3,"button",1),b(4,"Details"),h()()),t&2){let o;x(),_e((o=n.characterInfo())?1:-1,o)}},dependencies:[Yi,Se,Sn,Gi,In],encapsulation:2})};var pt=class{id;x;y;isMinimised;showTop;characterInfo;constructor(e,t,n,o){this.id=e,this.x=t,this.y=n,this.isMinimised=!0,this.characterInfo=o,this.showTop=!1}toggleMinimise(){this.isMinimised=!this.isMinimised}};var Kt=(o=>(o.FEUER="Feuer",o.WASSER="Wasser",o.ERDE="Erde",o.LUFT="Luft",o))(Kt||{});var Qt=(o=>(o.FLAMMENWERFER="Flammenwerfer",o.AQUATISCHE_ANGRIFFE="Aquatische Angriffe",o.ERDBEBEN="Erdbeben",o.WINDSTOSS="Windsto\xDF",o))(Qt||{});var At=class i{images=["./img/monster-icon-ChaosWarrior.png","./img/monster-icon-FimirAbomination.png","./img/monster-icon-Gargoyle.png","./img/monster-icon-Goblin.png","./img/monster-icon-Hexer.png","./img/monster-icon-Mummy.png","./img/monster-icon-Orc.png","./img/monster-icon-Skeleton.png","./img/monster-icon-Zombie.png"];CreateNewRandomMonster(){let e=Object.values(Kt),t=Object.values(Qt),n=`${Date.now()}-${Math.floor(Math.random()*1e3)}`,o=`Monster ${n}`,r=e[Math.floor(Math.random()*e.length)],a=Math.floor(Math.random()*200)+50,l=Math.floor(Math.random()*50)+5,c=Math.floor(Math.random()*50)+10,m=Math.floor(Math.random()*50)+5,d=Math.floor(Math.random()*30)+5,f=t.slice(0,Math.floor(Math.random()*t.length)+1),k=this.images[Math.floor(Math.random()*this.images.length)],I=`Dies ist eine zuf\xE4llige Beschreibung f\xFCr ${o}.`;return{id:n,name:o,type:r,health:a,armor:l,attack:c,defense:m,speed:d,abilities:f,image:k,description:I}}getInitMonsterCharacters(){return[{id:"1",name:"Monster A",type:"Feuer",health:100,armor:10,attack:20,defense:10,speed:15,abilities:["Flammenwerfer"],image:"./img/monster-icon-Gargoyle.png",description:"Dies ist ein Beschreibung f\xFCr Monster A."},{id:"2",name:"Monster B",type:"Wasser",health:120,armor:20,attack:15,defense:25,speed:10,abilities:["Aquatische Angriffe"],image:"./img/monster-icon-Gargoyle.png",description:"Dies ist ein Beschreibung f\xFCr Monster B."}]}static \u0275fac=function(t){return new(t||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})};var Re=class i{images=["./img/hero-icon-barbarian.jpeg","./img/hero-icon-dwarf.jpeg","./img/hero-icon-rogue.jpeg","./img/hero-icon-wizard.jpeg"];CreateNewRandomHero(){let e=Object.values(Kt),t=Object.values(Qt),n=`${Date.now()}-${Math.floor(Math.random()*1e3)}`,o=`Hero ${n}`,r=e[Math.floor(Math.random()*e.length)],a=Math.floor(Math.random()*200)+50,l=Math.floor(Math.random()*50)+5,c=Math.floor(Math.random()*50)+10,m=Math.floor(Math.random()*50)+5,d=Math.floor(Math.random()*30)+5,f=t.slice(0,Math.floor(Math.random()*t.length)+1),k=this.images[Math.floor(Math.random()*this.images.length)],I=`Dies ist eine zuf\xE4llige Beschreibung f\xFCr ${o}.`;return{id:n,name:o,type:r,health:a,armor:l,attack:c,defense:m,speed:d,abilities:f,image:k,description:I}}static \u0275fac=function(t){return new(t||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})};var Pe=(t=>(t.Normal="Normal",t.Critical="Critical",t))(Pe||{});var Ve=class i{CRITICAL_DAMAGE_MULTIPLIER=1;applyDamage(e,t,n){if(!(n<=0))switch(t){case"Normal":this.calculateNormalDamage(e,n);break;case"Critical":this.calculateCriticalDamage(e,n);break}}calculateNormalDamage(e,t){if(e.characterInfo.armor>=t)e.characterInfo.armor-=t;else{let n=t-e.characterInfo.armor;e.characterInfo.armor=0,e.characterInfo.health=Math.max(0,e.characterInfo.health-n)}}calculateCriticalDamage(e,t){let n=this.CRITICAL_DAMAGE_MULTIPLIER,o=Math.round(t*n);e.characterInfo.health=Math.max(0,e.characterInfo.health-o)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})};function Fn(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}function A(i){return i==null?"":typeof i=="string"?i:`${i}px`}var Jt=class{_attachedHost=null;attach(e){return this._attachedHost=e,e.attach(this)}detach(){let e=this._attachedHost;e!=null&&(this._attachedHost=null,e.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(e){this._attachedHost=e}},kt=class extends Jt{component;viewContainerRef;injector;projectableNodes;bindings;constructor(e,t,n,o,r){super(),this.component=e,this.viewContainerRef=t,this.injector=n,this.projectableNodes=o,this.bindings=r||null}},Ot=class extends Jt{templateRef;viewContainerRef;context;injector;constructor(e,t,n,o){super(),this.templateRef=e,this.viewContainerRef=t,this.context=n,this.injector=o}get origin(){return this.templateRef.elementRef}attach(e,t=this.context){return this.context=t,super.attach(e)}detach(){return this.context=void 0,super.detach()}},Rn=class extends Jt{element;constructor(e){super(),this.element=e instanceof L?e.nativeElement:e}},It=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(e){if(e instanceof kt)return this._attachedPortal=e,this.attachComponentPortal(e);if(e instanceof Ot)return this._attachedPortal=e,this.attachTemplatePortal(e);if(this.attachDomPortal&&e instanceof Rn)return this._attachedPortal=e,this.attachDomPortal(e)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(e){this._disposeFn=e}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},Ne=class extends It{outletElement;_appRef;_defaultInjector;constructor(e,t,n){super(),this.outletElement=e,this._appRef=t,this._defaultInjector=n}attachComponentPortal(e){let t;if(e.viewContainerRef){let n=e.injector||e.viewContainerRef.injector,o=n.get(pn,null,{optional:!0})||void 0;t=e.viewContainerRef.createComponent(e.component,{index:e.viewContainerRef.length,injector:n,ngModuleRef:o,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),this.setDisposeFn(()=>t.destroy())}else{let n=this._appRef,o=e.injector||this._defaultInjector||y.NULL,r=o.get(me,n.injector);t=Ci(e.component,{elementInjector:o,environmentInjector:r,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),n.attachView(t.hostView),this.setDisposeFn(()=>{n.viewCount>0&&n.detachView(t.hostView),t.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(t)),this._attachedPortal=e,t}attachTemplatePortal(e){let t=e.viewContainerRef,n=t.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return n.rootNodes.forEach(o=>this.outletElement.appendChild(o)),n.detectChanges(),this.setDisposeFn(()=>{let o=t.indexOf(n);o!==-1&&t.remove(o)}),this._attachedPortal=e,n}attachDomPortal=e=>{let t=e.element;t.parentNode;let n=this.outletElement.ownerDocument.createComment("dom-portal");t.parentNode.insertBefore(n,t),this.outletElement.appendChild(t),this._attachedPortal=e,super.setDisposeFn(()=>{n.parentNode&&n.parentNode.replaceChild(t,n)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(e){return e.hostView.rootNodes[0]}};var te=(()=>{class i extends It{_moduleRef=s(pn,{optional:!0});_document=s(P);_viewContainerRef=s(hn);_isInitialized=!1;_attachedRef=null;constructor(){super()}get portal(){return this._attachedPortal}set portal(t){this.hasAttached()&&!t&&!this._isInitialized||(this.hasAttached()&&super.detach(),t&&super.attach(t),this._attachedPortal=t||null)}attached=new G;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(t){t.setAttachedHost(this);let n=t.viewContainerRef!=null?t.viewContainerRef:this._viewContainerRef,o=n.createComponent(t.component,{index:n.length,injector:t.injector||n.injector,projectableNodes:t.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:t.bindings||void 0});return n!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=t,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(t){t.setAttachedHost(this);let n=this._viewContainerRef.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=t,this._attachedRef=n,this.attached.emit(n),n}attachDomPortal=t=>{let n=t.element;n.parentNode;let o=this._document.createComment("dom-portal");t.setAttachedHost(this),n.parentNode.insertBefore(o,n),this._getRootNode().appendChild(n),this._attachedPortal=t,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(n,o)})};_getRootNode(){let t=this._viewContainerRef.element.nativeElement;return t.nodeType===t.ELEMENT_NODE?t:t.parentNode}static \u0275fac=function(n){return new(n||i)};static \u0275dir=E({type:i,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[B]})}return i})(),ft=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({})}return i})();function Le(i,...e){return e.length?e.some(t=>i[t]):i.altKey||i.shiftKey||i.ctrlKey||i.metaKey}var Zi=wi();function Ft(i){return new Be(i.get(Wt),i.get(P))}var Be=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(e,t){this._viewportRuler=e,this._document=t}attach(){}enable(){if(this._canBeEnabled()){let e=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=e.style.left||"",this._previousHTMLStyles.top=e.style.top||"",e.style.left=A(-this._previousScrollPosition.left),e.style.top=A(-this._previousScrollPosition.top),e.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let e=this._document.documentElement,t=this._document.body,n=e.style,o=t.style,r=n.scrollBehavior||"",a=o.scrollBehavior||"";this._isEnabled=!1,n.left=this._previousHTMLStyles.left,n.top=this._previousHTMLStyles.top,e.classList.remove("cdk-global-scrollblock"),Zi&&(n.scrollBehavior=o.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),Zi&&(n.scrollBehavior=r,o.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let t=this._document.documentElement,n=this._viewportRuler.getViewportSize();return t.scrollHeight>n.height||t.scrollWidth>n.width}};function no(i,e){return new je(i.get(Cn),i.get(O),i.get(Wt),e)}var je=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(e,t,n,o){this._scrollDispatcher=e,this._ngZone=t,this._viewportRuler=n,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(this._scrollSubscription)return;let e=this._scrollDispatcher.scrolled(0).pipe(ut(t=>!t||!this._overlayRef.overlayElement.contains(t.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=e.subscribe(()=>{let t=this._viewportRuler.getViewportScrollPosition().top;Math.abs(t-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=e.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var ee=class{enable(){}disable(){}attach(){}};function Pn(i,e){return e.some(t=>{let n=i.bottom<t.top,o=i.top>t.bottom,r=i.right<t.left,a=i.left>t.right;return n||o||r||a})}function qi(i,e){return e.some(t=>{let n=i.top<t.top,o=i.bottom>t.bottom,r=i.left<t.left,a=i.right>t.right;return n||o||r||a})}function io(i,e){return new He(i.get(Cn),i.get(Wt),i.get(O),e)}var He=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(e,t,n,o){this._scrollDispatcher=e,this._viewportRuler=t,this._ngZone=n,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(!this._scrollSubscription){let e=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(e).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let t=this._overlayRef.overlayElement.getBoundingClientRect(),{width:n,height:o}=this._viewportRuler.getViewportSize();Pn(t,[{width:n,height:o,bottom:o,right:n,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},oo=(()=>{class i{_injector=s(y);constructor(){}noop=()=>new ee;close=t=>no(this._injector,t);block=()=>Ft(this._injector);reposition=t=>io(this._injector,t);static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),St=class{positionStrategy;scrollStrategy=new ee;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(e){if(e){let t=Object.keys(e);for(let n of t)e[n]!==void 0&&(this[n]=e[n])}}};var Ue=class{connectionPair;scrollableViewProperties;constructor(e,t){this.connectionPair=e,this.scrollableViewProperties=t}};var ro=(()=>{class i{_attachedOverlays=[];_document=s(P);_isAttached=!1;constructor(){}ngOnDestroy(){this.detach()}add(t){this.remove(t),this._attachedOverlays.push(t)}remove(t){let n=this._attachedOverlays.indexOf(t);n>-1&&this._attachedOverlays.splice(n,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(t,n,o){return o.observers.length<1?!1:t.eventPredicate?t.eventPredicate(n):!0}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),ao=(()=>{class i extends ro{_ngZone=s(O);_renderer=s(it).createRenderer(null,null);_cleanupKeydown;add(t){super.add(t),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=t=>{let n=this._attachedOverlays;for(let o=n.length-1;o>-1;o--){let r=n[o];if(this.canReceiveEvent(r,t,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(t));break}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),so=(()=>{class i extends ro{_platform=s(V);_ngZone=s(O);_renderer=s(it).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(t){if(super.add(t),!this._isAttached){let n=this._document.body,o={capture:!0},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(n,"pointerdown",this._pointerDownListener,o),r.listen(n,"click",this._clickListener,o),r.listen(n,"auxclick",this._clickListener,o),r.listen(n,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=n.style.cursor,n.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(t=>t()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=t=>{this._pointerDownEventTarget=U(t)};_clickListener=t=>{let n=U(t),o=t.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:n;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let a=r.length-1;a>-1;a--){let l=r[a],c=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,t,c))){if(Ki(l.overlayElement,n)||Ki(l.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>c.next(t)):c.next(t)}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Ki(i,e){let t=typeof ShadowRoot<"u"&&ShadowRoot,n=e;for(;n;){if(n===i)return!0;n=t&&n instanceof ShadowRoot?n.host:n.parentNode}return!1}var lo=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(n,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
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
`],encapsulation:2,changeDetection:0})}return i})(),We=(()=>{class i{_platform=s(V);_containerElement;_document=s(P);_styleLoader=s(K);constructor(){}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let t="cdk-overlay-container";if(this._platform.isBrowser||Fn()){let o=this._document.querySelectorAll(`.${t}[platform="server"], .${t}[platform="test"]`);for(let r=0;r<o.length;r++)o[r].remove()}let n=this._document.createElement("div");n.classList.add(t),Fn()?n.setAttribute("platform","test"):this._platform.isBrowser||n.setAttribute("platform","server"),this._document.body.appendChild(n),this._containerElement=n}_loadStyles(){this._styleLoader.load(lo)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Vn=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(e,t,n,o){this._renderer=t,this._ngZone=n,this.element=e.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=t.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let e=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),e.style.pointerEvents="none",e.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function Nn(i){return i&&i.nodeType===1}var Tt=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new D;_attachments=new D;_detachments=new D;_positionStrategy;_scrollStrategy;_locationChanges=dn.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new D;_outsidePointerEvents=new D;_afterNextRenderRef;constructor(e,t,n,o,r,a,l,c,m,d=!1,f,k){this._portalOutlet=e,this._host=t,this._pane=n,this._config=o,this._ngZone=r,this._keyboardDispatcher=a,this._document=l,this._location=c,this._outsideClickDispatcher=m,this._animationsDisabled=d,this._injector=f,this._renderer=k,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(e){if(this._disposed)return null;this._attachHost();let t=this._portalOutlet.attach(e);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=nt(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof t?.onDestroy=="function"&&t.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),t}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let e=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),e}dispose(){if(this._disposed)return;let e=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,e&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(e){e!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=e,this.hasAttached()&&(e.attach(this),this.updatePosition()))}updateSize(e){this._config=p(p({},this._config),e),this._updateElementSize()}setDirection(e){this._config=R(p({},this._config),{direction:e}),this._updateElementDirection()}addPanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!0)}removePanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!1)}getDirection(){let e=this._config.direction;return e?typeof e=="string"?e:e.value:"ltr"}updateScrollStrategy(e){e!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=e,this.hasAttached()&&(e.attach(this),e.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let e=this._pane.style;e.width=A(this._config.width),e.height=A(this._config.height),e.minWidth=A(this._config.minWidth),e.minHeight=A(this._config.minHeight),e.maxWidth=A(this._config.maxWidth),e.maxHeight=A(this._config.maxHeight)}_togglePointerEvents(e){this._pane.style.pointerEvents=e?"":"none"}_attachHost(){if(!this._host.parentElement){let e=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Nn(e)?e.after(this._host):e?.type==="parent"?e.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let e="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new Vn(this._document,this._renderer,this._ngZone,t=>{this._backdropClick.next(t)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(e))}):this._backdropRef.element.classList.add(e)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(e,t,n){let o=xt(t||[]).filter(r=>!!r);o.length&&(n?e.classList.add(...o):e.classList.remove(...o))}_detachContentWhenEmpty(){let e=!1;try{this._detachContentAfterRenderRef=nt(()=>{e=!0,this._detachContent()},{injector:this._injector})}catch(t){if(e)throw t;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let e=this._scrollStrategy;e?.disable(),e?.detach?.()}},Qi="cdk-overlay-connected-position-bounding-box",Ir=/([A-Za-z%]+)$/;function co(i,e){return new ze(e,i.get(Wt),i.get(P),i.get(V),i.get(We))}var ze=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new D;_resizeSubscription=dn.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(e,t,n,o,r){this._viewportRuler=t,this._document=n,this._platform=o,this._overlayContainer=r,this.setOrigin(e)}attach(e){this._overlayRef&&this._overlayRef,this._validatePositions(),e.hostElement.classList.add(Qi),this._overlayRef=e,this._boundingBox=e.hostElement,this._pane=e.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let e=this._originRect,t=this._overlayRect,n=this._viewportRect,o=this._containerRect,r=[],a;for(let l of this._preferredPositions){let c=this._getOriginPoint(e,o,l),m=this._getOverlayPoint(c,t,l),d=this._getOverlayFit(m,t,n,l);if(d.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(l,c);return}if(this._canFitWithFlexibleDimensions(d,m,n)){r.push({position:l,origin:c,overlayRect:t,boundingBoxRect:this._calculateBoundingBoxRect(c,l)});continue}(!a||a.overlayFit.visibleArea<d.visibleArea)&&(a={overlayFit:d,overlayPoint:m,originPoint:c,position:l,overlayRect:t})}if(r.length){let l=null,c=-1;for(let m of r){let d=m.boundingBoxRect.width*m.boundingBoxRect.height*(m.position.weight||1);d>c&&(c=d,l=m)}this._isPushed=!1,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&gt(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(Qi),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let e=this._lastPosition;e?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(e,this._getOriginPoint(this._originRect,this._containerRect,e))):this.apply()}withScrollableContainers(e){return this._scrollables=e,this}withPositions(e){return this._preferredPositions=e,e.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(e){return this._viewportMargin=e,this}withFlexibleDimensions(e=!0){return this._hasFlexibleDimensions=e,this}withGrowAfterOpen(e=!0){return this._growAfterOpen=e,this}withPush(e=!0){return this._canPush=e,this}withLockedPosition(e=!0){return this._positionLocked=e,this}setOrigin(e){return this._origin=e,this}withDefaultOffsetX(e){return this._offsetX=e,this}withDefaultOffsetY(e){return this._offsetY=e,this}withTransformOriginOn(e){return this._transformOriginSelector=e,this}withPopoverLocation(e){return this._popoverLocation=e,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof L?this._origin.nativeElement:Nn(this._origin)?this._origin:null}_getOriginPoint(e,t,n){let o;if(n.originX=="center")o=e.left+e.width/2;else{let a=this._isRtl()?e.right:e.left,l=this._isRtl()?e.left:e.right;o=n.originX=="start"?a:l}t.left<0&&(o-=t.left);let r;return n.originY=="center"?r=e.top+e.height/2:r=n.originY=="top"?e.top:e.bottom,t.top<0&&(r-=t.top),{x:o,y:r}}_getOverlayPoint(e,t,n){let o;n.overlayX=="center"?o=-t.width/2:n.overlayX==="start"?o=this._isRtl()?-t.width:0:o=this._isRtl()?0:-t.width;let r;return n.overlayY=="center"?r=-t.height/2:r=n.overlayY=="top"?0:-t.height,{x:e.x+o,y:e.y+r}}_getOverlayFit(e,t,n,o){let r=to(t),{x:a,y:l}=e,c=this._getOffset(o,"x"),m=this._getOffset(o,"y");c&&(a+=c),m&&(l+=m);let d=0-a,f=a+r.width-n.width,k=0-l,I=l+r.height-n.height,N=this._subtractOverflows(r.width,d,f),F=this._subtractOverflows(r.height,k,I),dt=N*F;return{visibleArea:dt,isCompletelyWithinViewport:r.width*r.height===dt,fitsInViewportVertically:F===r.height,fitsInViewportHorizontally:N==r.width}}_canFitWithFlexibleDimensions(e,t,n){if(this._hasFlexibleDimensions){let o=n.bottom-t.y,r=n.right-t.x,a=Ji(this._overlayRef.getConfig().minHeight),l=Ji(this._overlayRef.getConfig().minWidth),c=e.fitsInViewportVertically||a!=null&&a<=o,m=e.fitsInViewportHorizontally||l!=null&&l<=r;return c&&m}return!1}_pushOverlayOnScreen(e,t,n){if(this._previousPushAmount&&this._positionLocked)return{x:e.x+this._previousPushAmount.x,y:e.y+this._previousPushAmount.y};let o=to(t),r=this._viewportRect,a=Math.max(e.x+o.width-r.width,0),l=Math.max(e.y+o.height-r.height,0),c=Math.max(r.top-n.top-e.y,0),m=Math.max(r.left-n.left-e.x,0),d=0,f=0;return o.width<=r.width?d=m||-a:d=e.x<this._getViewportMarginStart()?r.left-n.left-e.x:0,o.height<=r.height?f=c||-l:f=e.y<this._getViewportMarginTop()?r.top-n.top-e.y:0,this._previousPushAmount={x:d,y:f},{x:e.x+d,y:e.y+f}}_applyPosition(e,t){if(this._setTransformOrigin(e),this._setOverlayElementStyles(t,e),this._setBoundingBoxStyles(t,e),e.panelClass&&this._addPanelClasses(e.panelClass),this._positionChanges.observers.length){let n=this._getScrollVisibility();if(e!==this._lastPosition||!this._lastScrollVisibility||!Sr(this._lastScrollVisibility,n)){let o=new Ue(e,n);this._positionChanges.next(o)}this._lastScrollVisibility=n}this._lastPosition=e,this._isInitialRender=!1}_setTransformOrigin(e){if(!this._transformOriginSelector)return;let t=this._boundingBox.querySelectorAll(this._transformOriginSelector),n,o=e.overlayY;e.overlayX==="center"?n="center":this._isRtl()?n=e.overlayX==="start"?"right":"left":n=e.overlayX==="start"?"left":"right";for(let r=0;r<t.length;r++)t[r].style.transformOrigin=`${n} ${o}`}_calculateBoundingBoxRect(e,t){let n=this._viewportRect,o=this._isRtl(),r,a,l;if(t.overlayY==="top")a=e.y,r=n.height-a+this._getViewportMarginBottom();else if(t.overlayY==="bottom")l=n.height-e.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=n.height-l+this._getViewportMarginTop();else{let I=Math.min(n.bottom-e.y+n.top,e.y),N=this._lastBoundingBoxSize.height;r=I*2,a=e.y-I,r>N&&!this._isInitialRender&&!this._growAfterOpen&&(a=e.y-N/2)}let c=t.overlayX==="start"&&!o||t.overlayX==="end"&&o,m=t.overlayX==="end"&&!o||t.overlayX==="start"&&o,d,f,k;if(m)k=n.width-e.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),d=e.x-this._getViewportMarginStart();else if(c)f=e.x,d=n.right-e.x-this._getViewportMarginEnd();else{let I=Math.min(n.right-e.x+n.left,e.x),N=this._lastBoundingBoxSize.width;d=I*2,f=e.x-I,d>N&&!this._isInitialRender&&!this._growAfterOpen&&(f=e.x-N/2)}return{top:a,left:f,bottom:l,right:k,width:d,height:r}}_setBoundingBoxStyles(e,t){let n=this._calculateBoundingBoxRect(e,t);!this._isInitialRender&&!this._growAfterOpen&&(n.height=Math.min(n.height,this._lastBoundingBoxSize.height),n.width=Math.min(n.width,this._lastBoundingBoxSize.width));let o={};if(this._hasExactPosition())o.top=o.left="0",o.bottom=o.right="auto",o.maxHeight=o.maxWidth="",o.width=o.height="100%";else{let r=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;o.width=A(n.width),o.height=A(n.height),o.top=A(n.top)||"auto",o.bottom=A(n.bottom)||"auto",o.left=A(n.left)||"auto",o.right=A(n.right)||"auto",t.overlayX==="center"?o.alignItems="center":o.alignItems=t.overlayX==="end"?"flex-end":"flex-start",t.overlayY==="center"?o.justifyContent="center":o.justifyContent=t.overlayY==="bottom"?"flex-end":"flex-start",r&&(o.maxHeight=A(r)),a&&(o.maxWidth=A(a))}this._lastBoundingBoxSize=n,gt(this._boundingBox.style,o)}_resetBoundingBoxStyles(){gt(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){gt(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(e,t){let n={},o=this._hasExactPosition(),r=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(o){let d=this._viewportRuler.getViewportScrollPosition();gt(n,this._getExactOverlayY(t,e,d)),gt(n,this._getExactOverlayX(t,e,d))}else n.position="static";let l="",c=this._getOffset(t,"x"),m=this._getOffset(t,"y");c&&(l+=`translateX(${c}px) `),m&&(l+=`translateY(${m}px)`),n.transform=l.trim(),a.maxHeight&&(o?n.maxHeight=A(a.maxHeight):r&&(n.maxHeight="")),a.maxWidth&&(o?n.maxWidth=A(a.maxWidth):r&&(n.maxWidth="")),gt(this._pane.style,n)}_getExactOverlayY(e,t,n){let o={top:"",bottom:""},r=this._getOverlayPoint(t,this._overlayRect,e);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,n)),e.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;o.bottom=`${a-(r.y+this._overlayRect.height)}px`}else o.top=A(r.y);return o}_getExactOverlayX(e,t,n){let o={left:"",right:""},r=this._getOverlayPoint(t,this._overlayRect,e);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,n));let a;if(this._isRtl()?a=e.overlayX==="end"?"left":"right":a=e.overlayX==="end"?"right":"left",a==="right"){let l=this._document.documentElement.clientWidth;o.right=`${l-(r.x+this._overlayRect.width)}px`}else o.left=A(r.x);return o}_getScrollVisibility(){let e=this._getOriginRect(),t=this._pane.getBoundingClientRect(),n=this._scrollables.map(o=>o.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:qi(e,n),isOriginOutsideView:Pn(e,n),isOverlayClipped:qi(t,n),isOverlayOutsideView:Pn(t,n)}}_subtractOverflows(e,...t){return t.reduce((n,o)=>n-Math.max(o,0),e)}_getNarrowedViewportRect(){let e=this._document.documentElement.clientWidth,t=this._document.documentElement.clientHeight,n=this._viewportRuler.getViewportScrollPosition();return{top:n.top+this._getViewportMarginTop(),left:n.left+this._getViewportMarginStart(),right:n.left+e-this._getViewportMarginEnd(),bottom:n.top+t-this._getViewportMarginBottom(),width:e-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:t-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(e,t){return t==="x"?e.offsetX==null?this._offsetX:e.offsetX:e.offsetY==null?this._offsetY:e.offsetY}_validatePositions(){}_addPanelClasses(e){this._pane&&xt(e).forEach(t=>{t!==""&&this._appliedPanelClasses.indexOf(t)===-1&&(this._appliedPanelClasses.push(t),this._pane.classList.add(t))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(e=>{this._pane.classList.remove(e)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let e=this._origin;if(e instanceof L)return e.nativeElement.getBoundingClientRect();if(e instanceof Element)return e.getBoundingClientRect();let t=e.width||0,n=e.height||0;return{top:e.y,bottom:e.y+n,left:e.x,right:e.x+t,height:n,width:t}}_getContainerRect(){let e=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",t=this._overlayContainer.getContainerElement();e&&(t.style.display="block");let n=t.getBoundingClientRect();return e&&(t.style.display=""),n}};function gt(i,e){for(let t in e)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function Ji(i){if(typeof i!="number"&&i!=null){let[e,t]=i.split(Ir);return!t||t==="px"?parseFloat(e):null}return i||null}function to(i){return{top:Math.floor(i.top),right:Math.floor(i.right),bottom:Math.floor(i.bottom),left:Math.floor(i.left),width:Math.floor(i.width),height:Math.floor(i.height)}}function Sr(i,e){return i===e?!0:i.isOriginClipped===e.isOriginClipped&&i.isOriginOutsideView===e.isOriginOutsideView&&i.isOverlayClipped===e.isOverlayClipped&&i.isOverlayOutsideView===e.isOverlayOutsideView}var eo="cdk-global-overlay-wrapper";function Rt(i){return new Ge}var Ge=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(e){let t=e.getConfig();this._overlayRef=e,this._width&&!t.width&&e.updateSize({width:this._width}),this._height&&!t.height&&e.updateSize({height:this._height}),e.hostElement.classList.add(eo),this._isDisposed=!1}top(e=""){return this._bottomOffset="",this._topOffset=e,this._alignItems="flex-start",this}left(e=""){return this._xOffset=e,this._xPosition="left",this}bottom(e=""){return this._topOffset="",this._bottomOffset=e,this._alignItems="flex-end",this}right(e=""){return this._xOffset=e,this._xPosition="right",this}start(e=""){return this._xOffset=e,this._xPosition="start",this}end(e=""){return this._xOffset=e,this._xPosition="end",this}width(e=""){return this._overlayRef?this._overlayRef.updateSize({width:e}):this._width=e,this}height(e=""){return this._overlayRef?this._overlayRef.updateSize({height:e}):this._height=e,this}centerHorizontally(e=""){return this.left(e),this._xPosition="center",this}centerVertically(e=""){return this.top(e),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement.style,n=this._overlayRef.getConfig(),{width:o,height:r,maxWidth:a,maxHeight:l}=n,c=(o==="100%"||o==="100vw")&&(!a||a==="100%"||a==="100vw"),m=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),d=this._xPosition,f=this._xOffset,k=this._overlayRef.getConfig().direction==="rtl",I="",N="",F="";c?F="flex-start":d==="center"?(F="center",k?N=f:I=f):k?d==="left"||d==="end"?(F="flex-end",I=f):(d==="right"||d==="start")&&(F="flex-start",N=f):d==="left"||d==="start"?(F="flex-start",I=f):(d==="right"||d==="end")&&(F="flex-end",N=f),e.position=this._cssPosition,e.marginLeft=c?"0":I,e.marginTop=m?"0":this._topOffset,e.marginBottom=this._bottomOffset,e.marginRight=c?"0":N,t.justifyContent=F,t.alignItems=m?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement,n=t.style;t.classList.remove(eo),n.justifyContent=n.alignItems=e.marginTop=e.marginBottom=e.marginLeft=e.marginRight=e.position="",this._overlayRef=null,this._isDisposed=!0}},uo=(()=>{class i{_injector=s(y);constructor(){}global(){return Rt()}flexibleConnectedTo(t){return co(this._injector,t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),mo=new v("OVERLAY_DEFAULT_CONFIG");function $e(i,e){i.get(K).load(lo);let t=i.get(We),n=i.get(P),o=i.get(st),r=i.get(fn),a=i.get(Gt),l=i.get(J,null,{optional:!0})||i.get(it).createRenderer(null,null),c=new St(e),m=i.get(mo,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||a.value,"showPopover"in n.body?c.usePopover=e?.usePopover??m:c.usePopover=!1;let d=n.createElement("div"),f=n.createElement("div");d.id=o.getId("cdk-overlay-"),d.classList.add("cdk-overlay-pane"),f.appendChild(d),c.usePopover&&(f.setAttribute("popover","manual"),f.classList.add("cdk-overlay-popover"));let k=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return Nn(k)?k.after(f):k?.type==="parent"?k.element.appendChild(f):t.getContainerElement().appendChild(f),new Tt(new Ne(d,r,i),f,d,c,i.get(O),i.get(ao),n,i.get(Di),i.get(so),e?.disableAnimations??i.get(he,null,{optional:!0})==="NoopAnimations",i.get(me),l)}var ho=(()=>{class i{scrollStrategies=s(oo);_positionBuilder=s(uo);_injector=s(y);constructor(){}create(t){return $e(this._injector,t)}position(){return this._positionBuilder}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var ne=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({providers:[ho],imports:[at,ft,Dn,Dn]})}return i})();var ie;function po(){if(ie==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>ie=!0}))}finally{ie=ie||!1}return ie}function Pt(i){return po()?i:!!i.capture}var fo=new v("cdk-input-modality-detector-options"),go={ignoreKeys:[18,17,224,91,16]},bo=650,Ln={passive:!0,capture:!0},_o=(()=>{class i{_platform=s(V);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Jn(null);_options;_lastTouchMs=0;_onKeydown=t=>{this._options?.ignoreKeys?.some(n=>n===t.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=U(t))};_onMousedown=t=>{Date.now()-this._lastTouchMs<bo||(this._modality.next(Ut(t)?"keyboard":"mouse"),this._mostRecentTarget=U(t))};_onTouchstart=t=>{if(zt(t)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=U(t)};constructor(){let t=s(O),n=s(P),o=s(fo,{optional:!0});if(this._options=p(p({},go),o),this.modalityDetected=this._modality.pipe(yt(1)),this.modalityChanged=this.modalityDetected.pipe(ai()),this._platform.isBrowser){let r=s(it).createRenderer(null,null);this._listenerCleanups=t.runOutsideAngular(()=>[r.listen(n,"keydown",this._onKeydown,Ln),r.listen(n,"mousedown",this._onMousedown,Ln),r.listen(n,"touchstart",this._onTouchstart,Ln)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(t=>t())}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),oe=(function(i){return i[i.IMMEDIATE=0]="IMMEDIATE",i[i.EVENTUAL=1]="EVENTUAL",i})(oe||{}),vo=new v("cdk-focus-monitor-default-options"),Ye=Pt({passive:!0,capture:!0}),re=(()=>{class i{_ngZone=s(O);_platform=s(V);_inputModalityDetector=s(_o);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=s(P);_stopInputModalityDetector=new D;constructor(){let t=s(vo,{optional:!0});this._detectionMode=t?.detectionMode||oe.IMMEDIATE}_rootNodeFocusAndBlurListener=t=>{let n=U(t);for(let o=n;o;o=o.parentElement)t.type==="focus"?this._onFocus(t,o):this._onBlur(t,o)};monitor(t,n=!1){let o=rt(t);if(!this._platform.isBrowser||o.nodeType!==1)return ei();let r=yn(o)||this._document,a=this._elementInfo.get(o);if(a)return n&&(a.checkChildren=!0),a.subject;let l={checkChildren:n,subject:new D,rootNode:r};return this._elementInfo.set(o,l),this._registerGlobalListeners(l),l.subject}stopMonitoring(t){let n=rt(t),o=this._elementInfo.get(n);o&&(o.subject.complete(),this._setClasses(n),this._elementInfo.delete(n),this._removeGlobalListeners(o))}focusVia(t,n,o){let r=rt(t),a=this._document.activeElement;r===a?this._getClosestElementsInfo(r).forEach(([l,c])=>this._originChanged(l,n,c)):(this._setOrigin(n),typeof r.focus=="function"&&r.focus(o))}ngOnDestroy(){this._elementInfo.forEach((t,n)=>this.stopMonitoring(n))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(t){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(t)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:t&&this._isLastInteractionFromInputLabel(t)?"mouse":"program"}_shouldBeAttributedToTouch(t){return this._detectionMode===oe.EVENTUAL||!!t?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(t,n){t.classList.toggle("cdk-focused",!!n),t.classList.toggle("cdk-touch-focused",n==="touch"),t.classList.toggle("cdk-keyboard-focused",n==="keyboard"),t.classList.toggle("cdk-mouse-focused",n==="mouse"),t.classList.toggle("cdk-program-focused",n==="program")}_setOrigin(t,n=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=t,this._originFromTouchInteraction=t==="touch"&&n,this._detectionMode===oe.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?bo:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(t,n){let o=this._elementInfo.get(n),r=U(t);!o||!o.checkChildren&&n!==r||this._originChanged(n,this._getFocusOrigin(r),o)}_onBlur(t,n){let o=this._elementInfo.get(n);!o||o.checkChildren&&t.relatedTarget instanceof Node&&n.contains(t.relatedTarget)||(this._setClasses(n),this._emitOrigin(o,null))}_emitOrigin(t,n){t.subject.observers.length&&this._ngZone.run(()=>t.subject.next(n))}_registerGlobalListeners(t){if(!this._platform.isBrowser)return;let n=t.rootNode,o=this._rootNodeFocusListenerCount.get(n)||0;o||this._ngZone.runOutsideAngular(()=>{n.addEventListener("focus",this._rootNodeFocusAndBlurListener,Ye),n.addEventListener("blur",this._rootNodeFocusAndBlurListener,Ye)}),this._rootNodeFocusListenerCount.set(n,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(de(this._stopInputModalityDetector)).subscribe(r=>{this._setOrigin(r,!0)}))}_removeGlobalListeners(t){let n=t.rootNode;if(this._rootNodeFocusListenerCount.has(n)){let o=this._rootNodeFocusListenerCount.get(n);o>1?this._rootNodeFocusListenerCount.set(n,o-1):(n.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Ye),n.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Ye),this._rootNodeFocusListenerCount.delete(n))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(t,n,o){this._setClasses(t,n),this._emitOrigin(o,n),this._lastFocusOrigin=n}_getClosestElementsInfo(t){let n=[];return this._elementInfo.forEach((o,r)=>{(r===t||o.checkChildren&&r.contains(t))&&n.push([r,o])}),n}_isLastInteractionFromInputLabel(t){let{_mostRecentTarget:n,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!n||n===t||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA"||t.disabled)return!1;let r=t.labels;if(r){for(let a=0;a<r.length;a++)if(r[a].contains(n))return!0}return!1}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var yo=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(n,o){},styles:[`.cdk-visually-hidden {
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
`],encapsulation:2,changeDetection:0})}return i})();var Co=new Set,bt,Xe=(()=>{class i{_platform=s(V);_nonce=s(li,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):Fr}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&Tr(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Tr(i,e){if(!Co.has(i))try{bt||(bt=document.createElement("style"),e&&bt.setAttribute("nonce",e),bt.setAttribute("type","text/css"),document.head.appendChild(bt)),bt.sheet&&(bt.sheet.insertRule(`@media ${i} {body{ }}`,0),Co.add(i))}catch(t){console.error(t)}}function Fr(i){return{matches:i==="all"||i==="",media:i,addListener:()=>{},removeListener:()=>{}}}var Bn=(()=>{class i{_mediaMatcher=s(Xe);_zone=s(O);_queries=new Map;_destroySubject=new D;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return Do(xt(t)).some(o=>this._registerQuery(o).mql.matches)}observe(t){let o=Do(xt(t)).map(a=>this._registerQuery(a).observable),r=ni(o);return r=ii(r.pipe(et(1)),r.pipe(yt(1),ce(0))),r.pipe(Nt(a=>{let l={matches:!1,breakpoints:{}};return a.forEach(({matches:c,query:m})=>{l.matches=l.matches||c,l.breakpoints[m]=c}),l}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);let n=this._mediaMatcher.matchMedia(t),r={observable:new un(a=>{let l=c=>this._zone.run(()=>a.next(c));return n.addListener(l),()=>{n.removeListener(l)}}).pipe(Ct(n),Nt(({matches:a})=>({query:t,matches:a})),de(this._destroySubject)),mql:n};return this._queries.set(t,r),r}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Do(i){return i.map(e=>e.split(",")).reduce((e,t)=>e.concat(t)).map(e=>e.trim())}var Rr=(()=>{class i{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var wo=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({providers:[Rr]})}return i})();var Un=(()=>{class i{_platform=s(V);constructor(){}isDisabled(t){return t.hasAttribute("disabled")}isVisible(t){return Vr(t)&&getComputedStyle(t).visibility==="visible"}isTabbable(t){if(!this._platform.isBrowser)return!1;let n=Pr(Gr(t));if(n&&(xo(n)===-1||!this.isVisible(n)))return!1;let o=t.nodeName.toLowerCase(),r=xo(t);return t.hasAttribute("contenteditable")?r!==-1:o==="iframe"||o==="object"||this._platform.WEBKIT&&this._platform.IOS&&!Ur(t)?!1:o==="audio"?t.hasAttribute("controls")?r!==-1:!1:o==="video"?r===-1?!1:r!==null?!0:this._platform.FIREFOX||t.hasAttribute("controls"):t.tabIndex>=0}isFocusable(t,n){return zr(t)&&!this.isDisabled(t)&&(n?.ignoreVisibility||this.isVisible(t))}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Pr(i){try{return i.frameElement}catch{return null}}function Vr(i){return!!(i.offsetWidth||i.offsetHeight||typeof i.getClientRects=="function"&&i.getClientRects().length)}function Nr(i){let e=i.nodeName.toLowerCase();return e==="input"||e==="select"||e==="button"||e==="textarea"}function Lr(i){return jr(i)&&i.type=="hidden"}function Br(i){return Hr(i)&&i.hasAttribute("href")}function jr(i){return i.nodeName.toLowerCase()=="input"}function Hr(i){return i.nodeName.toLowerCase()=="a"}function Ao(i){if(!i.hasAttribute("tabindex")||i.tabIndex===void 0)return!1;let e=i.getAttribute("tabindex");return!!(e&&!isNaN(parseInt(e,10)))}function xo(i){if(!Ao(i))return null;let e=parseInt(i.getAttribute("tabindex")||"",10);return isNaN(e)?-1:e}function Ur(i){let e=i.nodeName.toLowerCase(),t=e==="input"&&i.type;return t==="text"||t==="password"||e==="select"||e==="textarea"}function zr(i){return Lr(i)?!1:Nr(i)||Br(i)||i.hasAttribute("contenteditable")||Ao(i)}function Gr(i){return i.ownerDocument&&i.ownerDocument.defaultView||window}var Hn=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>this.focusLastTabbableElement();endAnchorListener=()=>this.focusFirstTabbableElement();get enabled(){return this._enabled}set enabled(e){this._enabled=e,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_enabled=!0;constructor(e,t,n,o,r=!1,a){this._element=e,this._checker=t,this._ngZone=n,this._document=o,this._injector=a,r||this.attachAnchors()}destroy(){let e=this._startAnchor,t=this._endAnchor;e&&(e.removeEventListener("focus",this.startAnchorListener),e.remove()),t&&(t.removeEventListener("focus",this.endAnchorListener),t.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusInitialElement(e)))})}focusFirstTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusFirstTabbableElement(e)))})}focusLastTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusLastTabbableElement(e)))})}_getRegionBoundary(e){let t=this._element.querySelectorAll(`[cdk-focus-region-${e}], [cdkFocusRegion${e}], [cdk-focus-${e}]`);return e=="start"?t.length?t[0]:this._getFirstTabbableElement(this._element):t.length?t[t.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(e){let t=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(t){if(!this._checker.isFocusable(t)){let n=this._getFirstTabbableElement(t);return n?.focus(e),!!n}return t.focus(e),!0}return this.focusFirstTabbableElement(e)}focusFirstTabbableElement(e){let t=this._getRegionBoundary("start");return t&&t.focus(e),!!t}focusLastTabbableElement(e){let t=this._getRegionBoundary("end");return t&&t.focus(e),!!t}hasAttached(){return this._hasAttached}_getFirstTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let n=0;n<t.length;n++){let o=t[n].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(t[n]):null;if(o)return o}return null}_getLastTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let n=t.length-1;n>=0;n--){let o=t[n].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(t[n]):null;if(o)return o}return null}_createAnchor(){let e=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,e),e.classList.add("cdk-visually-hidden"),e.classList.add("cdk-focus-trap-anchor"),e.setAttribute("aria-hidden","true"),e}_toggleAnchorTabIndex(e,t){e?t.setAttribute("tabindex","0"):t.removeAttribute("tabindex")}toggleAnchors(e){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_executeOnStable(e){this._injector?nt(e,{injector:this._injector}):setTimeout(e)}},ko=(()=>{class i{_checker=s(Un);_ngZone=s(O);_document=s(P);_injector=s(y);constructor(){s(K).load(yo)}create(t,n=!1){return new Hn(t,this._checker,this._ngZone,this._document,n,this._injector)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var _t=(function(i){return i[i.NONE=0]="NONE",i[i.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",i[i.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",i})(_t||{}),Eo="cdk-high-contrast-black-on-white",Mo="cdk-high-contrast-white-on-black",jn="cdk-high-contrast-active",Wr=(()=>{class i{_platform=s(V);_hasCheckedHighContrastMode=!1;_document=s(P);_breakpointSubscription;constructor(){this._breakpointSubscription=s(Bn).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return _t.NONE;let t=this._document.createElement("div");t.style.backgroundColor="rgb(1,2,3)",t.style.position="absolute",this._document.body.appendChild(t);let n=this._document.defaultView||window,o=n&&n.getComputedStyle?n.getComputedStyle(t):null,r=(o&&o.backgroundColor||"").replace(/ /g,"");switch(t.remove(),r){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return _t.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return _t.BLACK_ON_WHITE}return _t.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let t=this._document.body.classList;t.remove(jn,Eo,Mo),this._hasCheckedHighContrastMode=!0;let n=this.getHighContrastMode();n===_t.BLACK_ON_WHITE?t.add(jn,Eo):n===_t.WHITE_ON_BLACK&&t.add(jn,Mo)}}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Oo=(()=>{class i{constructor(){s(Wr)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({imports:[wo]})}return i})();function $r(i,e){}var lt=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext};var Gn=(()=>{class i extends It{_elementRef=s(L);_focusTrapFactory=s(ko);_config;_interactivityChecker=s(Un);_ngZone=s(O);_focusMonitor=s(re);_renderer=s(J);_changeDetectorRef=s(xe);_injector=s(y);_platform=s(V);_document=s(P);_portalOutlet;_focusTrapped=new D;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=s(lt,{optional:!0})||new lt,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(t){this._ariaLabelledByQueue.push(t),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(t){let n=this._ariaLabelledByQueue.indexOf(t);n>-1&&(this._ariaLabelledByQueue.splice(n,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(t){this._portalOutlet.hasAttached();let n=this._portalOutlet.attachComponentPortal(t);return this._contentAttached(),n}attachTemplatePortal(t){this._portalOutlet.hasAttached();let n=this._portalOutlet.attachTemplatePortal(t);return this._contentAttached(),n}attachDomPortal=t=>{this._portalOutlet.hasAttached();let n=this._portalOutlet.attachDomPortal(t);return this._contentAttached(),n};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(t,n){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{r(),a(),t.removeAttribute("tabindex")},r=this._renderer.listen(t,"blur",o),a=this._renderer.listen(t,"mousedown",o)})),t.focus(n)}_focusByCssSelector(t,n){let o=this._elementRef.nativeElement.querySelector(t);o&&this._forceFocus(o,n)}_trapFocus(t){this._isDestroyed||nt(()=>{let n=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||n.focus(t);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(t)||this._focusDialogContainer(t);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',t);break;default:this._focusByCssSelector(this._config.autoFocus,t);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let t=this._config.restoreFocus,n=null;if(typeof t=="string"?n=this._document.querySelector(t):typeof t=="boolean"?n=t?this._elementFocusedBeforeDialogWasOpened:null:t&&(n=t),this._config.restoreFocus&&n&&typeof n.focus=="function"){let o=Ht(),r=this._elementRef.nativeElement;(!o||o===this._document.body||o===r||r.contains(o))&&(this._focusMonitor?(this._focusMonitor.focusVia(n,this._closeInteractionType),this._closeInteractionType=null):n.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(t){this._elementRef.nativeElement.focus?.(t)}_containsFocus(){let t=this._elementRef.nativeElement,n=Ht();return t===n||t.contains(n)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Ht()))}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["cdk-dialog-container"]],viewQuery:function(n,o){if(n&1&&pi(te,7),n&2){let r;fi(r=gi())&&(o._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(n,o){n&2&&mt("id",o._config.id||null)("role",o._config.role)("aria-modal",o._config.ariaModal)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null)},features:[B],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(n,o){n&1&&ge(0,$r,0,0,"ng-template",0)},dependencies:[te],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2})}return i})(),ae=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new D;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(e,t){this.overlayRef=e,this.config=t,this.disableClose=t.disableClose,this.backdropClick=e.backdropClick(),this.keydownEvents=e.keydownEvents(),this.outsidePointerEvents=e.outsidePointerEvents(),this.id=t.id,this.keydownEvents.subscribe(n=>{n.keyCode===27&&!this.disableClose&&!Le(n)&&(n.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=e.detachments().subscribe(()=>{t.closeOnOverlayDetachments!==!1&&this.close()})}close(e,t){if(this._canClose(e)){let n=this.closed;this.containerInstance._closeInteractionType=t?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),n.next(e),n.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(e="",t=""){return this.overlayRef.updateSize({width:e,height:t}),this}addPanelClass(e){return this.overlayRef.addPanelClass(e),this}removePanelClass(e){return this.overlayRef.removePanelClass(e),this}_canClose(e){let t=this.config;return!!this.containerInstance&&(!t.closePredicate||t.closePredicate(e,t,this.componentInstance))}},Yr=new v("DialogScrollStrategy",{providedIn:"root",factory:()=>{let i=s(y);return()=>Ft(i)}}),Xr=new v("DialogData"),Zr=new v("DefaultDialogConfig");function qr(i){let e=Q(i),t=new G;return{valueSignal:e,get value(){return e()},change:t,ngOnDestroy(){t.complete()}}}var Wn=(()=>{class i{_injector=s(y);_defaultOptions=s(Zr,{optional:!0});_parentDialog=s(i,{optional:!0,skipSelf:!0});_overlayContainer=s(We);_idGenerator=s(st);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new D;_afterOpenedAtThisLevel=new D;_ariaHiddenElements=new Map;_scrollStrategy=s(Yr);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=le(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ct(void 0)));constructor(){}open(t,n){let o=this._defaultOptions||new lt;n=p(p({},o),n),n.id=n.id||this._idGenerator.getId("cdk-dialog-"),n.id&&this.getDialogById(n.id);let r=this._getOverlayConfig(n),a=$e(this._injector,r),l=new ae(a,n),c=this._attachContainer(a,l,n);if(l.containerInstance=c,!this.openDialogs.length){let m=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(et(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(m)}):this._hideNonDialogContentFromAssistiveTechnology(m)}return this._attachDialogContent(t,l,c,n),this.openDialogs.push(l),l.closed.subscribe(()=>this._removeOpenDialog(l,!0)),this.afterOpened.next(l),l}closeAll(){zn(this.openDialogs,t=>t.close())}getDialogById(t){return this.openDialogs.find(n=>n.id===t)}ngOnDestroy(){zn(this._openDialogsAtThisLevel,t=>{t.config.closeOnDestroy===!1&&this._removeOpenDialog(t,!1)}),zn(this._openDialogsAtThisLevel,t=>t.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(t){let n=new St({positionStrategy:t.positionStrategy||Rt().centerHorizontally().centerVertically(),scrollStrategy:t.scrollStrategy||this._scrollStrategy(),panelClass:t.panelClass,hasBackdrop:t.hasBackdrop,direction:t.direction,minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight,width:t.width,height:t.height,disposeOnNavigation:t.closeOnNavigation,disableAnimations:t.disableAnimations});return t.backdropClass&&(n.backdropClass=t.backdropClass),n}_attachContainer(t,n,o){let r=o.injector||o.viewContainerRef?.injector,a=[{provide:lt,useValue:o},{provide:ae,useValue:n},{provide:Tt,useValue:t}],l;o.container?typeof o.container=="function"?l=o.container:(l=o.container.type,a.push(...o.container.providers(o))):l=Gn;let c=new kt(l,o.viewContainerRef,y.create({parent:r||this._injector,providers:a}));return t.attach(c).instance}_attachDialogContent(t,n,o,r){if(t instanceof fe){let a=this._createInjector(r,n,o,void 0),l={$implicit:r.data,dialogRef:n};r.templateContext&&(l=p(p({},l),typeof r.templateContext=="function"?r.templateContext():r.templateContext)),o.attachTemplatePortal(new Ot(t,null,l,a))}else{let a=this._createInjector(r,n,o,this._injector),l=o.attachComponentPortal(new kt(t,r.viewContainerRef,a));n.componentRef=l,n.componentInstance=l.instance}}_createInjector(t,n,o,r){let a=t.injector||t.viewContainerRef?.injector,l=[{provide:Xr,useValue:t.data},{provide:ae,useValue:n}];return t.providers&&(typeof t.providers=="function"?l.push(...t.providers(n,t,o)):l.push(...t.providers)),t.direction&&(!a||!a.get(Gt,null,{optional:!0}))&&l.push({provide:Gt,useValue:qr(t.direction)}),y.create({parent:a||r,providers:l})}_removeOpenDialog(t,n){let o=this.openDialogs.indexOf(t);o>-1&&(this.openDialogs.splice(o,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((r,a)=>{r?a.setAttribute("aria-hidden",r):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),n&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(t){if(t.parentElement){let n=t.parentElement.children;for(let o=n.length-1;o>-1;o--){let r=n[o];r!==t&&r.nodeName!=="SCRIPT"&&r.nodeName!=="STYLE"&&!r.hasAttribute("aria-live")&&!r.hasAttribute("popover")&&(this._ariaHiddenElements.set(r,r.getAttribute("aria-hidden")),r.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function zn(i,e){let t=i.length;for(;t--;)e(i[t])}var So=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({providers:[Wn],imports:[ne,ft,Oo,ft]})}return i})();var Kr=new v("MATERIAL_ANIMATIONS"),To=null;function Qr(){return s(Kr,{optional:!0})?.animationsDisabled||s(he,{optional:!0})==="NoopAnimations"?"di-disabled":(To??=s(Xe).matchMedia("(prefers-reduced-motion)").matches,To?"reduced-motion":"enabled")}function vt(){return Qr()!=="enabled"}function Jr(i,e){}var qe=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration},$n="mdc-dialog--open",Fo="mdc-dialog--opening",Ro="mdc-dialog--closing",ta=150,ea=75,na=(()=>{class i extends Gn{_animationStateChanged=new G;_animationsEnabled=!vt();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?Vo(this._config.enterAnimationDuration)??ta:0;_exitAnimationDuration=this._animationsEnabled?Vo(this._config.exitAnimationDuration)??ea:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(Po,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Fo,$n)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add($n),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove($n),this._animationsEnabled?(this._hostElement.style.setProperty(Po,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Ro)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(t){this._actionSectionCount+=t,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(Fo,Ro)}_waitForAnimationToComplete(t,n){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(n,t)}_requestAnimationFrame(t){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(t):t()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(t){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:t})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(t){let n=super.attachComponentPortal(t);return n.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),n}static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275cmp=C({type:i,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(n,o){n&2&&(gn("id",o._config.id),mt("aria-modal",o._config.ariaModal)("role",o._config.role)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null),W("_mat-animation-noopable",!o._animationsEnabled)("mat-mdc-dialog-container-with-actions",o._actionSectionCount>0))},features:[B],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(n,o){n&1&&(u(0,"div",0)(1,"div",1),ge(2,Jr,0,0,"ng-template",2),h()())},dependencies:[te],styles:[`.mat-mdc-dialog-container {
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
`],encapsulation:2})}return i})(),Po="--mat-dialog-transition-duration";function Vo(i){return i==null?null:typeof i=="number"?i:i.endsWith("ms")?Ee(i.substring(0,i.length-2)):i.endsWith("s")?Ee(i.substring(0,i.length-1))*1e3:i==="0"?0:null}var Ze=(function(i){return i[i.OPEN=0]="OPEN",i[i.CLOSING=1]="CLOSING",i[i.CLOSED=2]="CLOSED",i})(Ze||{}),ct=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new Vt(1);_beforeClosed=new Vt(1);_result;_closeFallbackTimeout;_state=Ze.OPEN;_closeInteractionType;constructor(e,t,n){this._ref=e,this._config=t,this._containerInstance=n,this.disableClose=t.disableClose,this.id=e.id,e.addPanelClass("mat-mdc-dialog-panel"),n._animationStateChanged.pipe(ut(o=>o.state==="opened"),et(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),n._animationStateChanged.pipe(ut(o=>o.state==="closed"),et(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),e.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),ri(this.backdropClick(),this.keydownEvents().pipe(ut(o=>o.keyCode===27&&!this.disableClose&&!Le(o)))).subscribe(o=>{this.disableClose||(o.preventDefault(),ia(this,o.type==="keydown"?"keyboard":"mouse"))})}close(e){let t=this._config.closePredicate;t&&!t(e,this._config,this.componentInstance)||(this._result=e,this._containerInstance._animationStateChanged.pipe(ut(n=>n.state==="closing"),et(1)).subscribe(n=>{this._beforeClosed.next(e),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),n.totalTime+100)}),this._state=Ze.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(e){let t=this._ref.config.positionStrategy;return e&&(e.left||e.right)?e.left?t.left(e.left):t.right(e.right):t.centerHorizontally(),e&&(e.top||e.bottom)?e.top?t.top(e.top):t.bottom(e.bottom):t.centerVertically(),this._ref.updatePosition(),this}updateSize(e="",t=""){return this._ref.updateSize(e,t),this}addPanelClass(e){return this._ref.addPanelClass(e),this}removePanelClass(e){return this._ref.removePanelClass(e),this}getState(){return this._state}_finishDialogClose(){this._state=Ze.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function ia(i,e,t){return i._closeInteractionType=e,i.close(t)}var oa=new v("MatMdcDialogData"),ra=new v("mat-mdc-dialog-default-options"),aa=new v("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(y);return()=>Ft(i)}}),Ke=(()=>{class i{_defaultOptions=s(ra,{optional:!0});_scrollStrategy=s(aa);_parentDialog=s(i,{optional:!0,skipSelf:!0});_idGenerator=s(st);_injector=s(y);_dialog=s(Wn);_animationsDisabled=vt();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new D;_afterOpenedAtThisLevel=new D;dialogConfigClass=qe;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=le(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ct(void 0)));constructor(){this._dialogRefConstructor=ct,this._dialogContainerType=na,this._dialogDataToken=oa}open(t,n){let o;n=p(p({},this._defaultOptions||new qe),n),n.id=n.id||this._idGenerator.getId("mat-mdc-dialog-"),n.scrollStrategy=n.scrollStrategy||this._scrollStrategy();let r=this._dialog.open(t,R(p({},n),{positionStrategy:Rt(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||n.enterAnimationDuration?.toLocaleString()==="0"||n.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:n},{provide:lt,useValue:n}]},templateContext:()=>({dialogRef:o}),providers:(a,l,c)=>(o=new this._dialogRefConstructor(a,n,c),o.updatePosition(n?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:l.data},{provide:this._dialogRefConstructor,useValue:o}])}));return o.componentRef=r.componentRef,o.componentInstance=r.componentInstance,this.openDialogs.push(o),this.afterOpened.next(o),o.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(o);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),o}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(t){return this.openDialogs.find(n=>n.id===t)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(t){let n=t.length;for(;n--;)t[n].close()}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var No=(()=>{class i{_dialogRef=s(ct,{optional:!0});_elementRef=s(L);_dialog=s(Ke);constructor(){}ngOnInit(){this._dialogRef||(this._dialogRef=sa(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(n){return new(n||i)};static \u0275dir=E({type:i})}return i})(),Qe=(()=>{class i extends No{id=s(st).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275dir=E({type:i,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(n,o){n&2&&gn("id",o.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[B]})}return i})(),Je=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275dir=E({type:i,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[ci([xi])]})}return i})(),tn=(()=>{class i extends No{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=Y(i)))(o||i)}})();static \u0275dir=E({type:i,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(n,o){n&2&&W("mat-mdc-dialog-actions-align-start",o.align==="start")("mat-mdc-dialog-actions-align-center",o.align==="center")("mat-mdc-dialog-actions-align-end",o.align==="end")},inputs:{align:"align"},features:[B]})}return i})();function sa(i,e){let t=i.nativeElement.parentElement;for(;t&&!t.classList.contains("mat-mdc-dialog-container");)t=t.parentElement;return t?e.find(n=>n.id===t.id):null}var en=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({providers:[Ke],imports:[So,ne,ft,at]})}return i})();var $=(function(i){return i[i.FADING_IN=0]="FADING_IN",i[i.VISIBLE=1]="VISIBLE",i[i.FADING_OUT=2]="FADING_OUT",i[i.HIDDEN=3]="HIDDEN",i})($||{}),Yn=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=$.HIDDEN;constructor(e,t,n,o=!1){this._renderer=e,this.element=t,this.config=n,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},Bo=Pt({passive:!0,capture:!0}),Xn=class{_events=new Map;addHandler(e,t,n,o){let r=this._events.get(t);if(r){let a=r.get(n);a?a.add(o):r.set(n,new Set([o]))}else this._events.set(t,new Map([[n,new Set([o])]])),e.runOutsideAngular(()=>{document.addEventListener(t,this._delegateEventHandler,Bo)})}removeHandler(e,t,n){let o=this._events.get(e);if(!o)return;let r=o.get(t);r&&(r.delete(n),r.size===0&&o.delete(t),o.size===0&&(this._events.delete(e),document.removeEventListener(e,this._delegateEventHandler,Bo)))}_delegateEventHandler=e=>{let t=U(e);t&&this._events.get(e.type)?.forEach((n,o)=>{(o===t||o.contains(t))&&n.forEach(r=>r.handleEvent(e))})}},se={enterDuration:225,exitDuration:150},la=800,jo=Pt({passive:!0,capture:!0}),Ho=["mousedown","touchstart"],Uo=["mouseup","mouseleave","touchend","touchcancel"],ca=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(n,o){},styles:[`.mat-ripple {
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
`],encapsulation:2,changeDetection:0})}return i})(),nn=class i{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Xn;constructor(e,t,n,o,r){this._target=e,this._ngZone=t,this._platform=o,o.isBrowser&&(this._containerElement=rt(n)),r&&r.get(K).load(ca)}fadeInRipple(e,t,n={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=p(p({},se),n.animation);n.centered&&(e=o.left+o.width/2,t=o.top+o.height/2);let a=n.radius||da(e,t,o),l=e-o.left,c=t-o.top,m=r.enterDuration,d=document.createElement("div");d.classList.add("mat-ripple-element"),d.style.left=`${l-a}px`,d.style.top=`${c-a}px`,d.style.height=`${a*2}px`,d.style.width=`${a*2}px`,n.color!=null&&(d.style.backgroundColor=n.color),d.style.transitionDuration=`${m}ms`,this._containerElement.appendChild(d);let f=window.getComputedStyle(d),k=f.transitionProperty,I=f.transitionDuration,N=k==="none"||I==="0s"||I==="0s, 0s"||o.width===0&&o.height===0,F=new Yn(this,d,n,N);d.style.transform="scale3d(1, 1, 1)",F.state=$.FADING_IN,n.persistent||(this._mostRecentTransientRipple=F);let dt=null;return!N&&(m||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let Kn=()=>{dt&&(dt.fallbackTimer=null),clearTimeout(Qn),this._finishRippleTransition(F)},cn=()=>this._destroyRipple(F),Qn=setTimeout(cn,m+100);d.addEventListener("transitionend",Kn),d.addEventListener("transitioncancel",cn),dt={onTransitionEnd:Kn,onTransitionCancel:cn,fallbackTimer:Qn}}),this._activeRipples.set(F,dt),(N||!m)&&this._finishRippleTransition(F),F}fadeOutRipple(e){if(e.state===$.FADING_OUT||e.state===$.HIDDEN)return;let t=e.element,n=p(p({},se),e.config.animation);t.style.transitionDuration=`${n.exitDuration}ms`,t.style.opacity="0",e.state=$.FADING_OUT,(e._animationForciblyDisabledThroughCss||!n.exitDuration)&&this._finishRippleTransition(e)}fadeOutAll(){this._getActiveRipples().forEach(e=>e.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(e=>{e.config.persistent||e.fadeOut()})}setupTriggerEvents(e){let t=rt(e);!this._platform.isBrowser||!t||t===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=t,Ho.forEach(n=>{i._eventManager.addHandler(this._ngZone,n,t,this)}))}handleEvent(e){e.type==="mousedown"?this._onMousedown(e):e.type==="touchstart"?this._onTouchStart(e):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Uo.forEach(t=>{this._triggerElement.addEventListener(t,this,jo)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(e){e.state===$.FADING_IN?this._startFadeOutTransition(e):e.state===$.FADING_OUT&&this._destroyRipple(e)}_startFadeOutTransition(e){let t=e===this._mostRecentTransientRipple,{persistent:n}=e.config;e.state=$.VISIBLE,!n&&(!t||!this._isPointerDown)&&e.fadeOut()}_destroyRipple(e){let t=this._activeRipples.get(e)??null;this._activeRipples.delete(e),this._activeRipples.size||(this._containerRect=null),e===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),e.state=$.HIDDEN,t!==null&&(e.element.removeEventListener("transitionend",t.onTransitionEnd),e.element.removeEventListener("transitioncancel",t.onTransitionCancel),t.fallbackTimer!==null&&clearTimeout(t.fallbackTimer)),e.element.remove()}_onMousedown(e){let t=Ut(e),n=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+la;!this._target.rippleDisabled&&!t&&!n&&(this._isPointerDown=!0,this.fadeInRipple(e.clientX,e.clientY,this._target.rippleConfig))}_onTouchStart(e){if(!this._target.rippleDisabled&&!zt(e)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let t=e.changedTouches;if(t)for(let n=0;n<t.length;n++)this.fadeInRipple(t[n].clientX,t[n].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(e=>{let t=e.state===$.VISIBLE||e.config.terminateOnPointerUp&&e.state===$.FADING_IN;!e.config.persistent&&t&&e.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let e=this._triggerElement;e&&(Ho.forEach(t=>i._eventManager.removeHandler(t,e,this)),this._pointerUpEventsRegistered&&(Uo.forEach(t=>e.removeEventListener(t,this,jo)),this._pointerUpEventsRegistered=!1))}};function da(i,e,t){let n=Math.max(Math.abs(i-t.left),Math.abs(i-t.right)),o=Math.max(Math.abs(e-t.top),Math.abs(e-t.bottom));return Math.sqrt(n*n+o*o)}var zo=new v("mat-ripple-global-options");var ua={capture:!0},ma=["focus","mousedown","mouseenter","touchstart"],Zn="mat-ripple-loader-uninitialized",qn="mat-ripple-loader-class-name",Go="mat-ripple-loader-centered",on="mat-ripple-loader-disabled",Wo=(()=>{class i{_document=s(P);_animationsDisabled=vt();_globalRippleOptions=s(zo,{optional:!0});_platform=s(V);_ngZone=s(O);_injector=s(y);_eventCleanups;_hosts=new Map;constructor(){let t=s(it).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>ma.map(n=>t.listen(this._document,n,this._onInteraction,ua)))}ngOnDestroy(){let t=this._hosts.keys();for(let n of t)this.destroyRipple(n);this._eventCleanups.forEach(n=>n())}configureRipple(t,n){t.setAttribute(Zn,this._globalRippleOptions?.namespace??""),(n.className||!t.hasAttribute(qn))&&t.setAttribute(qn,n.className||""),n.centered&&t.setAttribute(Go,""),n.disabled&&t.setAttribute(on,"")}setDisabled(t,n){let o=this._hosts.get(t);o?(o.target.rippleDisabled=n,!n&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(t))):n?t.setAttribute(on,""):t.removeAttribute(on)}_onInteraction=t=>{let n=U(t);if(n instanceof HTMLElement){let o=n.closest(`[${Zn}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(t){if(!this._document||this._hosts.has(t))return;t.querySelector(".mat-ripple")?.remove();let n=this._document.createElement("span");n.classList.add("mat-ripple",t.getAttribute(qn)),t.append(n);let o=this._globalRippleOptions,r=this._animationsDisabled?0:o?.animation?.enterDuration??se.enterDuration,a=this._animationsDisabled?0:o?.animation?.exitDuration??se.exitDuration,l={rippleDisabled:this._animationsDisabled||o?.disabled||t.hasAttribute(on),rippleConfig:{centered:t.hasAttribute(Go),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:r,exitDuration:a}}},c=new nn(l,this._ngZone,n,this._platform,this._injector),m=!l.rippleDisabled;m&&c.setupTriggerEvents(t),this._hosts.set(t,{target:l,renderer:c,hasSetUpEvents:m}),t.removeAttribute(Zn)}destroyRipple(t){let n=this._hosts.get(t);n&&(n.renderer._removeTriggerEvents(),this._hosts.delete(t))}static \u0275fac=function(n){return new(n||i)};static \u0275prov=g({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var $o=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["structural-styles"]],decls:0,vars:0,template:function(n,o){},styles:[`.mat-focus-indicator {
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
`],encapsulation:2,changeDetection:0})}return i})();var ha=new v("MAT_BUTTON_CONFIG");function Yo(i){return i==null?void 0:yi(i)}var Xo=(()=>{class i{_elementRef=s(L);_ngZone=s(O);_animationsDisabled=vt();_config=s(ha,{optional:!0});_focusMonitor=s(re);_cleanupClick;_renderer=s(J);_rippleLoader=s(Wo);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=t,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(t){this.tabIndex=t}constructor(){s(K).load($o);let t=this._elementRef.nativeElement;this._isAnchor=t.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(t,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(t="program",n){t?this._focusMonitor.focusVia(this._elementRef.nativeElement,t,n):this._elementRef.nativeElement.focus(n)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}))}static \u0275fac=function(n){return new(n||i)};static \u0275dir=E({type:i,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(n,o){n&2&&(mt("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),De(o.color?"mat-"+o.color:""),W("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",tt],disabled:[2,"disabled","disabled",tt],ariaDisabled:[2,"aria-disabled","ariaDisabled",tt],disabledInteractive:[2,"disabledInteractive","disabledInteractive",tt],tabIndex:[2,"tabIndex","tabIndex",Yo],_tabindex:[2,"tabindex","_tabindex",Yo]}})}return i})();var Zo=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({imports:[at]})}return i})();var pa=["matButton",""],fa=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],ga=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var qo=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),rn=(()=>{class i extends Xo{get appearance(){return this._appearance}set appearance(t){this.setAppearance(t||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let t=ba(this._elementRef.nativeElement);t&&this.setAppearance(t)}setAppearance(t){if(t===this._appearance)return;let n=this._elementRef.nativeElement.classList,o=this._appearance?qo.get(this._appearance):null,r=qo.get(t);o&&n.remove(...o),n.add(...r),this._appearance=t}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=C({type:i,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[B],attrs:pa,ngContentSelectors:ga,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(n,o){n&1&&(bn(fa),Ce(0,"span",0),Bt(1),mi(2,"span",1),Bt(3,1),hi(),Bt(4,2),Ce(5,"span",2)(6,"span",3)),n&2&&W("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab)},styles:[`.mat-mdc-button-base {
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
`],encapsulation:2,changeDetection:0})}return i})();function ba(i){return i.hasAttribute("mat-raised-button")?"elevated":i.hasAttribute("mat-stroked-button")?"outlined":i.hasAttribute("mat-flat-button")?"filled":i.hasAttribute("mat-button")?"text":null}var an=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=T({type:i});static \u0275inj=S({imports:[Zo,at]})}return i})();function _a(i,e){if(i&1){let t=ot();u(0,"button",5),_("click",function(){let o=j(t).$implicit,r=M();return H(r.confirmDamageTaken(o))}),b(1),h()}if(i&2){let t=e.$implicit,n=M();De(n.getButtonColorClass(t)),x(),wt(" ",t," ")}}var sn=class i{dialogRef=s(ct);damageOptions=Array.from({length:100},(e,t)=>t+1);onNoClick(){this.dialogRef.close(!1)}confirmDamageTaken(e){this.dialogRef.close(e)}getButtonColorClass(e){return e<=10?"!bg-green-100 !text-green-800 hover:!bg-green-200":e<=30?"!bg-lime-100 !text-lime-800 hover:!bg-lime-200":e<=50?"!bg-amber-100 !text-amber-800 hover:!bg-amber-200":e<=75?"!bg-orange-200 !text-orange-900 hover:!bg-orange-300":"!bg-red-600 !text-white hover:!bg-red-700"}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=C({type:i,selectors:[["app-damage-taken-dialog"]],decls:9,vars:0,consts:[["mat-dialog-title","",1,"!text-xl","!font-bold","text-gray-800"],[1,"grid","grid-cols-6","sm:grid-cols-10","gap-1.5","max-h-[55vh]","overflow-y-auto","p-1","bg-gray-50","rounded-lg","border","border-gray-100"],["mat-flat-button","",1,"damage-grid-btn","text-xs","font-bold","transition-all","duration-200","hover:scale-105","active:scale-95",3,"class"],["align","end",1,"border-t","pt-2"],["mat-button","",1,"!text-gray-500","font-semibold",3,"click"],["mat-flat-button","",1,"damage-grid-btn","text-xs","font-bold","transition-all","duration-200","hover:scale-105","active:scale-95",3,"click"]],template:function(t,n){t&1&&(u(0,"h2",0),b(1,"Schaden ausw\xE4hlen"),h(),u(2,"mat-dialog-content")(3,"div",1),ve(4,_a,2,3,"button",2,ui),h()(),u(6,"mat-dialog-actions",3)(7,"button",4),_("click",function(){return n.onNoClick()}),b(8,"Abbrechen"),h()()),t&2&&(x(4),ye(n.damageOptions))},dependencies:[en,Qe,tn,Je,an,rn],styles:['@charset "UTF-8";.damage-grid-btn[_ngcontent-%COMP%]{min-width:0!important;min-height:0!important;padding:0!important;width:100%!important;aspect-ratio:1/1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:6px!important}']})};var ln=class i{monstersService=s(At);dialogRef=s(ct);damageOptions=Array.from({length:100},(e,t)=>t+1);onNoClick(){this.dialogRef.close(!1)}onOkClick(){let e=this.monstersService.CreateNewRandomMonster();this.dialogRef.close(e)}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=C({type:i,selectors:[["app-add-character-dialog"]],decls:39,vars:0,consts:[["mat-dialog-title","",1,"!text-xl","!font-bold","text-gray-800"],[1,"flex","flex-col","gap-4"],[1,"text-gray-600"],[1,"flex","flex-row","gap-4","p-4","overflow-x-auto"],["src","img/monster-icon-ChaosWarrior.png","alt","",1,"monster-image"],["src","img/monster-icon-FimirAbomination.png","alt","",1,"monster-image"],["src","img/monster-icon-Gargoyle.png","alt","",1,"monster-image"],["src","img/monster-icon-Goblin.png","alt","",1,"monster-image"],["src","img/monster-icon-Hexer.png","alt","",1,"monster-image"],["src","img/monster-icon-Mummy.png","alt","",1,"monster-image"],["src","img/monster-icon-Orc.png","alt","",1,"monster-image"],["src","img/monster-icon-Skeleton.png","alt","",1,"monster-image"],["src","img/monster-icon-Zombie.png","alt","",1,"monster-image"],[1,"flex","flex-row","gap-2","p-4"],["mat-button","",1,"difficulty-btn","!bg-gray-200","hover:!bg-gray-300","!text-gray-800",3,"click"],[1,"selectable-color-box","!bg-red-500"],[1,"selectable-color-box","!bg-blue-500"],[1,"selectable-color-box","!bg-green-500"],[1,"selectable-color-box","!bg-pink-500"],[1,"selectable-color-box","!bg-white-500"],[1,"selectable-color-box","!bg-yellow-500"],[1,"selectable-color-box","!bg-yellow-700"],[1,"selectable-color-box","!bg-pink-900"],["align","end",1,"border-t","pt-2"],["mat-button","",1,"!text-gray-500","font-semibold",3,"click"]],template:function(t,n){t&1&&(u(0,"h2",0),b(1,"Neuen Character erstellen"),h(),u(2,"mat-dialog-content")(3,"div",1)(4,"p",2),b(5,"Monstertyp"),h()(),u(6,"div",3),Z(7,"img",4)(8,"img",5)(9,"img",6)(10,"img",7)(11,"img",8)(12,"img",9)(13,"img",10)(14,"img",11)(15,"img",12),h(),u(16,"div",13)(17,"button",14),_("click",function(){return n.onOkClick()}),b(18,"Leicht"),h(),u(19,"button",14),_("click",function(){return n.onOkClick()}),b(20,"Mittel"),h(),u(21,"button",14),_("click",function(){return n.onOkClick()}),b(22,"Schwer"),h(),u(23,"button",14),_("click",function(){return n.onOkClick()}),b(24,"Extrem"),h()(),u(25,"div",13),Z(26,"div",15)(27,"div",16)(28,"div",17)(29,"div",18)(30,"div",19)(31,"div",20)(32,"div",21)(33,"div",22),h()(),u(34,"mat-dialog-actions",23)(35,"button",24),_("click",function(){return n.onOkClick()}),b(36,"Ok"),h(),u(37,"button",24),_("click",function(){return n.onNoClick()}),b(38,"Abbrechen"),h()())},dependencies:[an,rn,en,Qe,tn,Je],styles:['@charset "UTF-8";.selectable-color-box[_ngcontent-%COMP%]{width:32px;height:32px;border-radius:4px;border:2px solid #ccc;cursor:pointer;transition:transform .3s ease,box-shadow .3s ease}.selectable-color-box[_ngcontent-%COMP%]:hover{transform:scale(1.1);box-shadow:0 4px 8px #0003}.monster-image[_ngcontent-%COMP%]{width:64px;height:64px;object-fit:scale-down;transition:transform .3s ease,box-shadow .3s ease}.monster-image[_ngcontent-%COMP%]:hover{transform:scale(1.1);box-shadow:0 4px 8px #0003}.damage-grid-btn[_ngcontent-%COMP%]{min-width:0!important;min-height:0!important;padding:0!important;width:100%!important;aspect-ratio:1/1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:6px!important}']})};var va=()=>({x:0,y:0}),ya=(i,e)=>e.id;function Ca(i,e){if(i&1){let t=ot();u(0,"div",7)(1,"div",9),Z(2,"img",10),u(3,"button",11),_("click",function(){j(t);let o=M().$implicit,r=M();return H(r.openDamageTakenDialog(r.DamageTypes.Normal,o))}),Z(4,"img",12),h(),u(5,"button",13),_("click",function(){j(t);let o=M().$implicit,r=M();return H(r.openDamageTakenDialog(r.DamageTypes.Critical,o))}),Z(6,"img",14),h()(),u(7,"div",9)(8,"span",15),b(9),h(),u(10,"span",16),b(11),h()()()}if(i&2){let t=M().$implicit;x(2),X("src",_n(t.characterInfo.image),pe)("alt",_n(t.characterInfo.name)),x(7),Dt(t.characterInfo.health),x(2),Dt(t.characterInfo.armor)}}function Da(i,e){if(i&1){let t=ot();u(0,"div",8)(1,"app-character-card",17),_("characterInfoChange",function(o){j(t);let r=M().$implicit,a=M();return H(a.updateCharacterInList(r.id,o))}),h(),u(2,"button",18),_("click",function(){j(t);let o=M().$implicit,r=M();return H(r.removeMovableCharacteritem(o))}),b(3," DEL "),h()()}if(i&2){let t=M().$implicit;x(),X("characterInfo",t.characterInfo)}}function wa(i,e){if(i&1){let t=ot();u(0,"div",5),_("cdkDragEnded",function(o){let r=j(t).$implicit,a=M();return H(a.onDragEnded(o,r))})("click",function(){let o=j(t).$implicit,r=M();return H(r.showMovableCharacterItemOnTop(o))}),u(1,"div",6),_("dblclick",function(o){return j(t).$implicit.toggleMinimise(),H(o.stopPropagation())}),u(2,"span"),b(3),h()(),be(4,Ca,12,6,"div",7)(5,Da,4,1,"div",8),h()}if(i&2){let t=e.$implicit;bi("left",t.x,"px")("top",t.y,"px"),W("is-on-top",t.showTop),X("cdkDragFreeDragPosition",_i(9,va)),x(3),wt("::: ",t.characterInfo.name," :::"),x(),_e(t.isMinimised?4:5)}}var Qo=class i{DamageTypes=Pe;charactersDbService=s(Me);monsterCharacterCreatorService=s(At);heroCharacterCreatorService=s(Re);combatCalculatorService=s(Ve);dialog=s(Ke);newCharacterCardPosition={x:50,y:50};movableCharacterItems=Q([]);constructor(){this.loadMonstersFromDb()}loadMonstersFromDb(){let t=(this.charactersDbService.readCharacters()||this.monsterCharacterCreatorService.getInitMonsterCharacters()).map((n,o)=>new pt(o+1,50+o*100,50+o*100,n));this.movableCharacterItems.set(t)}addMonster(){let e=this.movableCharacterItems().length+1,t=this.monsterCharacterCreatorService.CreateNewRandomMonster();this.charactersDbService.writeCharacter(t);let n=new pt(e,this.newCharacterCardPosition.x,this.newCharacterCardPosition.y,t);this.movableCharacterItems.update(o=>[...o,n])}addHero(){let e=this.movableCharacterItems().length+1,t=this.heroCharacterCreatorService.CreateNewRandomHero();this.charactersDbService.writeCharacter(t);let n=new pt(e,this.newCharacterCardPosition.x,this.newCharacterCardPosition.y,t);this.movableCharacterItems.update(o=>[...o,n])}addCharacter(){this.dialog.open(ln,{width:"80vw",maxWidth:"80vw",height:"80vh",maxHeight:"80vh"}).afterClosed().subscribe(t=>{if(t!==void 0&&t!==!1){let n=this.movableCharacterItems().length+1,o=new pt(n,this.newCharacterCardPosition.x,this.newCharacterCardPosition.y,R(p({},t),{id:n}));this.movableCharacterItems.update(r=>[...r,o])}})}showMovableCharacterItemOnTop(e){this.movableCharacterItems.update(t=>(t.forEach(n=>n.showTop=!1),e.showTop=!0,[...t]))}onDragEnded(e,t){let n=e.source.getFreeDragPosition();t.x+=n.x,t.y+=n.y,e.source.reset()}removeMovableCharacteritem(e){this.charactersDbService.removeCharacter(e.characterInfo),this.movableCharacterItems.update(t=>t.filter(n=>n!==e))}openDamageTakenDialog(e,t){this.dialog.open(sn,{width:"80vw",maxWidth:"80vw",height:"80vh",maxHeight:"80vh"}).afterClosed().subscribe(o=>{o!==void 0&&o!==!1&&(this.combatCalculatorService.applyDamage(t,e,o),this.movableCharacterItems.update(r=>r.map(a=>(a.id===t.id&&(a.characterInfo=p({},a.characterInfo)),a))),this.charactersDbService.writeCharacter(t.characterInfo))})}updateCharacterInList(e,t){t&&this.movableCharacterItems.update(n=>n.map(o=>(o.id===e&&(o.characterInfo=t,this.charactersDbService.writeCharacter(t)),o)))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=C({type:i,selectors:[["app-monster-tracker-page"]],decls:11,vars:0,consts:[[1,"character-tracker-page","bg-yellow-500","h-full"],[1,"monster-tracker-ex-page-menue"],[1,"bg-blue-500","hover:bg-blue-700","text-white","font-bold","py-2","px-4","rounded",3,"click"],[1,"boundary-container","overflow-scroll","bg-gray-400","h-[100%]"],["cdkDrag","",1,"draggable-box",3,"is-on-top","cdkDragFreeDragPosition","left","top"],["cdkDrag","",1,"draggable-box",3,"cdkDragEnded","click","cdkDragFreeDragPosition"],["cdkDragHandle","",1,"handle",3,"dblclick"],[1,"minimized-content","p-1"],[1,"content"],[1,"flex","flex-row","items-center","justify-center"],["draggable","false",1,"h-[48px]","w-[48px]","mr-4",3,"src","alt"],[1,"h-[30px]","w-[30px]","hover:bg-blue-700","text-white","font-bold","rounded",3,"click"],["draggable","false","src","./img/hit-normal.svg","alt","normal-hit",1,"object-contain"],[1,"ml-4","h-[30px]","w-[30px]","hover:bg-red-700","text-white","font-bold","rounded",3,"click"],["draggable","false","src","./img/hit-critical.svg","alt","critical-hit",1,"object-contain"],[1,"text-green-400","ml-2"],[1,"text-blue-400","ml-2"],[3,"characterInfoChange","characterInfo"],[1,"h-[30px]","w-[30px]","bg-blue-500","hover:bg-red-700","text-white","font-bold","rounded",3,"click"]],template:function(t,n){t&1&&(u(0,"div",0)(1,"div",1)(2,"button",2),_("click",function(){return n.addMonster()}),b(3,"Add Monster"),h(),u(4,"button",2),_("click",function(){return n.addHero()}),b(5,"Add Hero"),h(),u(6,"button",2),_("click",function(){return n.addCharacter()}),b(7,"Add Character"),h()(),u(8,"div",3),ve(9,wa,6,10,"div",4,ya),h()()),t&2&&(x(9),ye(n.movableCharacterItems()))},dependencies:[Ai,Mi,Ei,Fe],styles:['@charset "UTF-8";.boundary-container[_ngcontent-%COMP%]{position:relative}.draggable-box[_ngcontent-%COMP%]{position:absolute;width:200px;min-height:75px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 6px #0000001a;display:flex;flex-direction:column;cursor:grab}.draggable-box[_ngcontent-%COMP%]:active{cursor:grabbing}.handle[_ngcontent-%COMP%]{background:#3f51b5;color:#fff;padding:5px;font-size:12px;text-align:center;cursor:move;border-top-left-radius:7px;border-top-right-radius:7px}.content[_ngcontent-%COMP%]{padding:2px}.minimized-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-center;justify-content:space-around}.is-on-top[_ngcontent-%COMP%]{z-index:9999!important}']})};export{Qo as CharacterTrackerPage};
