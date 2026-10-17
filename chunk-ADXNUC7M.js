import{a as j,b as Fe,c as wt,d as R,e as Et,f as xt,g as ee,h as $,i as A,j as At,k as Tn,l as X,m as Re,n as Pn,o as Mt,q as Te,r as Z,s as ct}from"./chunk-7QMAQ5ZZ.js";import{b as Rn}from"./chunk-IBROUTES.js";import{a as Ie}from"./chunk-YISA4GSY.js";import{D as _n,E as z,Ea as G,F as vn,Fa as Zt,Ga as W,Ha as H,Ia as P,Ib as Qt,J as Gt,Ja as Ae,K as at,Ka as Me,Lb as J,M as Wt,Mb as Jt,Na as I,Oa as D,Pa as b,Q as Yt,Qa as Cn,R as p,Ra as O,S as C,Sa as Kt,Sb as te,U as f,Ua as Dn,Vb as U,W as s,Wa as Oe,Wb as In,Xa as Y,Xb as Fn,Z as $t,a as h,b as T,ba as _,c as Ee,ca as E,cb as wn,db as En,e as dn,f as g,fa as V,fb as xn,g as un,ga as y,gb as An,h as xe,hb as qt,jb as ke,k as hn,ka as st,kb as Ct,l as mn,na as lt,nb as Se,oa as L,ob as Dt,q as yt,qa as x,qb as Mn,r as pn,rb as On,sb as kn,u as fn,v as zt,va as Xt,vb as B,w as gn,wa as yn,wb as Sn,y as bn,z as Q}from"./chunk-G6GM7NHQ.js";var zn=(()=>{class i{_renderer;_elementRef;onChange=t=>{};onTouched=()=>{};constructor(t,n){this._renderer=t,this._elementRef=n}setProperty(t,n){this._renderer.setProperty(this._elementRef.nativeElement,t,n)}registerOnTouched(t){this.onTouched=t}registerOnChange(t){this.onChange=t}setDisabledState(t){this.setProperty("disabled",t)}static \u0275fac=function(n){return new(n||i)(P(H),P(x))};static \u0275dir=b({type:i})}return i})(),Gn=(()=>{class i extends zn{static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275dir=b({type:i,features:[O]})}return i})(),je=new f("");var io={provide:je,useExisting:Yt(()=>Wn),multi:!0};function oo(){let i=Ie()?Ie().getUserAgent():"";return/android (\d+)/.test(i.toLowerCase())}var ro=new f(""),Wn=(()=>{class i extends zn{_compositionMode;_composing=!1;constructor(t,n,o){super(t,n),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!oo())}writeValue(t){let n=t??"";this.setProperty("value",n)}_handleInput(t){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(t)}_compositionStart(){this._composing=!0}_compositionEnd(t){this._composing=!1,this._compositionMode&&this.onChange(t)}static \u0275fac=function(n){return new(n||i)(P(H),P(x),P(ro,8))};static \u0275dir=b({type:i,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(n,o){n&1&&Ct("input",function(a){return o._handleInput(a.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(a){return o._compositionEnd(a.target.value)})},standalone:!1,features:[Qt([io]),O]})}return i})();var ao=new f(""),so=new f("");function Yn(i){return i!=null}function $n(i){return Dn(i)?hn(i):i}function Xn(i){let e={};return i.forEach(t=>{e=t!=null?h(h({},e),t):e}),Object.keys(e).length===0?null:e}function Zn(i,e){return e.map(t=>t(i))}function lo(i){return!i.validate}function Kn(i){return i.map(e=>lo(e)?e:t=>e.validate(t))}function co(i){if(!i)return null;let e=i.filter(Yn);return e.length==0?null:function(t){return Xn(Zn(t,e))}}function qn(i){return i!=null?co(Kn(i)):null}function uo(i){if(!i)return null;let e=i.filter(Yn);return e.length==0?null:function(t){let n=Zn(t,e).map($n);return gn(n).pipe(yt(Xn))}}function Qn(i){return i!=null?uo(Kn(i)):null}function Vn(i,e){return i===null?[e]:Array.isArray(i)?[...i,e]:[i,e]}function ho(i){return i._rawValidators}function mo(i){return i._rawAsyncValidators}function Pe(i){return i?Array.isArray(i)?i:[i]:[]}function ie(i,e){return Array.isArray(i)?i.includes(e):i===e}function Nn(i,e){let t=Pe(e);return Pe(i).forEach(o=>{ie(t,o)||t.push(o)}),t}function Ln(i,e){return Pe(e).filter(t=>!ie(i,t))}var oe=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(e){this._rawValidators=e||[],this._composedValidatorFn=qn(this._rawValidators)}_setAsyncValidators(e){this._rawAsyncValidators=e||[],this._composedAsyncValidatorFn=Qn(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(e){this._onDestroyCallbacks.push(e)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(e=>e()),this._onDestroyCallbacks=[]}reset(e=void 0){this.control?.reset(e)}hasError(e,t){return this.control?this.control.hasError(e,t):!1}getError(e,t){return this.control?this.control.getError(e,t):null}},Ve=class extends oe{name;get formDirective(){return null}get path(){return null}},Ft=class extends oe{_parent=null;name=null;valueAccessor=null},Ne=class{_cd;constructor(e){this._cd=e}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Lr=(()=>{class i extends Ne{constructor(t){super(t)}static \u0275fac=function(n){return new(n||i)(P(Ft,2))};static \u0275dir=b({type:i,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(n,o){n&2&&B("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[O]})}return i})();var Ot="VALID",ne="INVALID",dt="PENDING",kt="DISABLED",tt=class{},re=class extends tt{value;source;constructor(e,t){super(),this.value=e,this.source=t}},St=class extends tt{pristine;source;constructor(e,t){super(),this.pristine=e,this.source=t}},It=class extends tt{touched;source;constructor(e,t){super(),this.touched=e,this.source=t}},ut=class extends tt{status;source;constructor(e,t){super(),this.status=e,this.source=t}};var Le=class extends tt{source;constructor(e){super(),this.source=e}};function po(i){return(ae(i)?i.validators:i)||null}function fo(i){return Array.isArray(i)?qn(i):i||null}function go(i,e){return(ae(e)?e.asyncValidators:i)||null}function bo(i){return Array.isArray(i)?Qn(i):i||null}function ae(i){return i!=null&&!Array.isArray(i)&&typeof i=="object"}var Be=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(e,t){this._assignValidators(e),this._assignAsyncValidators(t)}get validator(){return this._composedValidatorFn}set validator(e){this._rawValidators=this._composedValidatorFn=e}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(e){this._rawAsyncValidators=this._composedAsyncValidatorFn=e}get parent(){return this._parent}get status(){return J(this.statusReactive)}set status(e){J(()=>this.statusReactive.set(e))}_status=Jt(()=>this.statusReactive());statusReactive=st(void 0);get valid(){return this.status===Ot}get invalid(){return this.status===ne}get pending(){return this.status===dt}get disabled(){return this.status===kt}get enabled(){return this.status!==kt}errors;get pristine(){return J(this.pristineReactive)}set pristine(e){J(()=>this.pristineReactive.set(e))}_pristine=Jt(()=>this.pristineReactive());pristineReactive=st(!0);get dirty(){return!this.pristine}get touched(){return J(this.touchedReactive)}set touched(e){J(()=>this.touchedReactive.set(e))}_touched=Jt(()=>this.touchedReactive());touchedReactive=st(!1);get untouched(){return!this.touched}_events=new g;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(e){this._assignValidators(e)}setAsyncValidators(e){this._assignAsyncValidators(e)}addValidators(e){this.setValidators(Nn(e,this._rawValidators))}addAsyncValidators(e){this.setAsyncValidators(Nn(e,this._rawAsyncValidators))}removeValidators(e){this.setValidators(Ln(e,this._rawValidators))}removeAsyncValidators(e){this.setAsyncValidators(Ln(e,this._rawAsyncValidators))}hasValidator(e){return ie(this._rawValidators,e)}hasAsyncValidator(e){return ie(this._rawAsyncValidators,e)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(e={}){let t=this.touched===!1;this.touched=!0;let n=e.sourceControl??this;e.onlySelf||this._parent?.markAsTouched(T(h({},e),{sourceControl:n})),t&&e.emitEvent!==!1&&this._events.next(new It(!0,n))}markAllAsDirty(e={}){this.markAsDirty({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsDirty(e))}markAllAsTouched(e={}){this.markAsTouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:this}),this._forEachChild(t=>t.markAllAsTouched(e))}markAsUntouched(e={}){let t=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let n=e.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:e.emitEvent,sourceControl:n})}),e.onlySelf||this._parent?._updateTouched(e,n),t&&e.emitEvent!==!1&&this._events.next(new It(!1,n))}markAsDirty(e={}){let t=this.pristine===!0;this.pristine=!1;let n=e.sourceControl??this;e.onlySelf||this._parent?.markAsDirty(T(h({},e),{sourceControl:n})),t&&e.emitEvent!==!1&&this._events.next(new St(!1,n))}markAsPristine(e={}){let t=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let n=e.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:e.emitEvent})}),e.onlySelf||this._parent?._updatePristine(e,n),t&&e.emitEvent!==!1&&this._events.next(new St(!0,n))}markAsPending(e={}){this.status=dt;let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new ut(this.status,t)),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.markAsPending(T(h({},e),{sourceControl:t}))}disable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=kt,this.errors=null,this._forEachChild(o=>{o.disable(T(h({},e),{onlySelf:!0}))}),this._updateValue();let n=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new re(this.value,n)),this._events.next(new ut(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(T(h({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(e={}){let t=this._parentMarkedDirty(e.onlySelf);this.status=Ot,this._forEachChild(n=>{n.enable(T(h({},e),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent}),this._updateAncestors(T(h({},e),{skipPristineCheck:t}),this),this._onDisabledChange.forEach(n=>n(!1))}_updateAncestors(e,t){e.onlySelf||(this._parent?.updateValueAndValidity(e),e.skipPristineCheck||this._parent?._updatePristine({},t),this._parent?._updateTouched({},t))}setParent(e){this._parent=e}getRawValue(){return this.value}updateValueAndValidity(e={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let n=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Ot||this.status===dt)&&this._runAsyncValidator(n,e.emitEvent)}let t=e.sourceControl??this;e.emitEvent!==!1&&(this._events.next(new re(this.value,t)),this._events.next(new ut(this.status,t)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),e.onlySelf||this._parent?.updateValueAndValidity(T(h({},e),{sourceControl:t}))}_updateTreeValidity(e={emitEvent:!0}){this._forEachChild(t=>t._updateTreeValidity(e)),this.updateValueAndValidity({onlySelf:!0,emitEvent:e.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?kt:Ot}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(e,t){if(this.asyncValidator){this.status=dt,this._hasOwnPendingAsyncValidator={emitEvent:t!==!1,shouldHaveEmitted:e!==!1};let n=$n(this.asyncValidator(this));this._asyncValidationSubscription=n.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:t,shouldHaveEmitted:e})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let e=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,e}return!1}setErrors(e,t={}){this.errors=e,this._updateControlsErrors(t.emitEvent!==!1,this,t.shouldHaveEmitted)}get(e){let t=e;return t==null||(Array.isArray(t)||(t=t.split(".")),t.length===0)?null:t.reduce((n,o)=>n&&n._find(o),this)}getError(e,t){let n=t?this.get(t):this;return n?.errors?n.errors[e]:null}hasError(e,t){return!!this.getError(e,t)}get root(){let e=this;for(;e._parent;)e=e._parent;return e}_updateControlsErrors(e,t,n){this.status=this._calculateStatus(),e&&this.statusChanges.emit(this.status),(e||n)&&this._events.next(new ut(this.status,t)),this._parent&&this._parent._updateControlsErrors(e,t,n)}_initObservables(){this.valueChanges=new V,this.statusChanges=new V}_calculateStatus(){return this._allControlsDisabled()?kt:this.errors?ne:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(dt)?dt:this._anyControlsHaveStatus(ne)?ne:Ot}_anyControlsHaveStatus(e){return this._anyControls(t=>t.status===e)}_anyControlsDirty(){return this._anyControls(e=>e.dirty)}_anyControlsTouched(){return this._anyControls(e=>e.touched)}_updatePristine(e,t){let n=!this._anyControlsDirty(),o=this.pristine!==n;this.pristine=n,e.onlySelf||this._parent?._updatePristine(e,t),o&&this._events.next(new St(this.pristine,t))}_updateTouched(e={},t){this.touched=this._anyControlsTouched(),this._events.next(new It(this.touched,t)),e.onlySelf||this._parent?._updateTouched(e,t)}_onDisabledChange=[];_registerOnCollectionChange(e){this._onCollectionChange=e}_setUpdateStrategy(e){ae(e)&&e.updateOn!=null&&(this._updateOn=e.updateOn)}_parentMarkedDirty(e){return!e&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(e){return null}_assignValidators(e){this._rawValidators=Array.isArray(e)?e.slice():e,this._composedValidatorFn=fo(this._rawValidators)}_assignAsyncValidators(e){this._rawAsyncValidators=Array.isArray(e)?e.slice():e,this._composedAsyncValidatorFn=bo(this._rawAsyncValidators)}};var Jn=new f("",{factory:()=>He}),He="always";function _o(i,e){return[...e.path,i]}function vo(i,e,t=He){Co(i,e),e.valueAccessor.writeValue(i.value),(i.disabled||t==="always")&&e.valueAccessor.setDisabledState?.(i.disabled),Do(i,e),Eo(i,e),wo(i,e),yo(i,e)}function Bn(i,e){i.forEach(t=>{t.registerOnValidatorChange&&t.registerOnValidatorChange(e)})}function yo(i,e){if(e.valueAccessor.setDisabledState){let t=n=>{e.valueAccessor.setDisabledState(n)};i.registerOnDisabledChange(t),e._registerOnDestroy(()=>{i._unregisterOnDisabledChange(t)})}}function Co(i,e){let t=ho(i);e.validator!==null?i.setValidators(Vn(t,e.validator)):typeof t=="function"&&i.setValidators([t]);let n=mo(i);e.asyncValidator!==null?i.setAsyncValidators(Vn(n,e.asyncValidator)):typeof n=="function"&&i.setAsyncValidators([n]);let o=()=>i.updateValueAndValidity();Bn(e._rawValidators,o),Bn(e._rawAsyncValidators,o)}function Do(i,e){e.valueAccessor.registerOnChange(t=>{i._pendingValue=t,i._pendingChange=!0,i._pendingDirty=!0,i.updateOn==="change"&&ti(i,e)})}function wo(i,e){e.valueAccessor.registerOnTouched(()=>{i._pendingTouched=!0,i.updateOn==="blur"&&i._pendingChange&&ti(i,e),i.updateOn!=="submit"&&i.markAsTouched()})}function ti(i,e){i._pendingDirty&&i.markAsDirty(),i.setValue(i._pendingValue,{emitModelToViewChange:!1}),e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1}function Eo(i,e){let t=(n,o)=>{e.valueAccessor.writeValue(n),o&&e.viewToModelUpdate(n)};i.registerOnChange(t),e._registerOnDestroy(()=>{i._unregisterOnChange(t)})}function xo(i,e){if(!i.hasOwnProperty("model"))return!1;let t=i.model;return t.isFirstChange()?!0:!Object.is(e,t.currentValue)}function Ao(i){return Object.getPrototypeOf(i.constructor)===Gn}function Mo(i,e){if(!e)return null;Array.isArray(e);let t,n,o;return e.forEach(r=>{r.constructor===Wn?t=r:Ao(r)?n=r:o=r}),o||n||t||null}function jn(i,e){let t=i.indexOf(e);t>-1&&i.splice(t,1)}function Hn(i){return typeof i=="object"&&i!==null&&Object.keys(i).length===2&&"value"in i&&"disabled"in i}var Oo=class extends Be{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(e=null,t,n){super(po(t),go(n,t)),this._applyFormState(e),this._setUpdateStrategy(t),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),ae(t)&&(t.nonNullable||t.initialValueIsDefault)&&(Hn(e)?this.defaultValue=e.value:this.defaultValue=e)}setValue(e,t={}){this.value=this._pendingValue=e,this._onChange.length&&t.emitModelToViewChange!==!1&&this._onChange.forEach(n=>n(this.value,t.emitViewToModelChange!==!1)),this.updateValueAndValidity(t)}patchValue(e,t={}){this.setValue(e,t)}reset(e=this.defaultValue,t={}){this._applyFormState(e),this.markAsPristine(t),this.markAsUntouched(t),this.setValue(this.value,t),t.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,t?.emitEvent!==!1&&this._events.next(new Le(this))}_updateValue(){}_anyControls(e){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(e){this._onChange.push(e)}_unregisterOnChange(e){jn(this._onChange,e)}registerOnDisabledChange(e){this._onDisabledChange.push(e)}_unregisterOnDisabledChange(e){jn(this._onDisabledChange,e)}_forEachChild(e){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(e){Hn(e)?(this.value=this._pendingValue=e.value,e.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=e}};var ko={provide:Ft,useExisting:Yt(()=>So)},Un=Promise.resolve(),So=(()=>{class i extends Ft{_changeDetectorRef;callSetDisabledState;control=new Oo;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new V;constructor(t,n,o,r,a,l){super(),this._changeDetectorRef=a,this.callSetDisabledState=l,this._parent=t,this._setValidators(n),this._setAsyncValidators(o),this.valueAccessor=Mo(this,r)}ngOnChanges(t){if(this._checkForErrors(),!this._registered||"name"in t){if(this._registered&&(this._checkName(),this.formDirective)){let n=t.name.previousValue;this.formDirective.removeControl({name:n,path:this._getPath(n)})}this._setUpControl()}"isDisabled"in t&&this._updateDisabled(t),xo(t,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(t){this.viewModel=t,this.update.emit(t)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){vo(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(t){Un.then(()=>{this.control.setValue(t,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(t){let n=t.isDisabled.currentValue,o=n!==0&&U(n);Un.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(t){return this._parent?_o(t,this._parent):[t]}static \u0275fac=function(n){return new(n||i)(P(Ve,9),P(ao,10),P(so,10),P(je,10),P(te,8),P(Jn,8))};static \u0275dir=b({type:i,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[Qt([ko]),O,lt]})}return i})();var Io={provide:je,useExisting:Yt(()=>Fo),multi:!0},Fo=(()=>{class i extends Gn{writeValue(t){let n=t??"";this.setProperty("value",n)}registerOnChange(t){this.onChange=n=>{t(n==""?null:parseFloat(n))}}static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275dir=b({type:i,selectors:[["input","type","number","formControlName",""],["input","type","number","formControl",""],["input","type","number","ngModel",""]],hostBindings:function(n,o){n&1&&Ct("input",function(a){return o.onChange(a.target.value)})("blur",function(){return o.onTouched()})},standalone:!1,features:[Qt([Io]),O]})}return i})();var Ro=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({})}return i})();var jr=(()=>{class i{static withConfig(t){return{ngModule:i,providers:[{provide:Jn,useValue:t.callSetDisabledState??He}]}}static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({imports:[Ro]})}return i})();function Ue(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}function v(i){return i==null?"":typeof i=="string"?i:`${i}px`}var Rt=class{_attachedHost=null;attach(e){return this._attachedHost=e,e.attach(this)}detach(){let e=this._attachedHost;e!=null&&(this._attachedHost=null,e.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(e){this._attachedHost=e}},ht=class extends Rt{component;viewContainerRef;injector;projectableNodes;bindings;constructor(e,t,n,o,r){super(),this.component=e,this.viewContainerRef=t,this.injector=n,this.projectableNodes=o,this.bindings=r||null}},mt=class extends Rt{templateRef;viewContainerRef;context;injector;constructor(e,t,n,o){super(),this.templateRef=e,this.viewContainerRef=t,this.context=n,this.injector=o}get origin(){return this.templateRef.elementRef}attach(e,t=this.context){return this.context=t,super.attach(e)}detach(){return this.context=void 0,super.detach()}},ze=class extends Rt{element;constructor(e){super(),this.element=e instanceof x?e.nativeElement:e}},pt=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(e){if(e instanceof ht)return this._attachedPortal=e,this.attachComponentPortal(e);if(e instanceof mt)return this._attachedPortal=e,this.attachTemplatePortal(e);if(this.attachDomPortal&&e instanceof ze)return this._attachedPortal=e,this.attachDomPortal(e)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(e){this._disposeFn=e}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},se=class extends pt{outletElement;_appRef;_defaultInjector;constructor(e,t,n){super(),this.outletElement=e,this._appRef=t,this._defaultInjector=n}attachComponentPortal(e){let t;if(e.viewContainerRef){let n=e.injector||e.viewContainerRef.injector,o=n.get(Me,null,{optional:!0})||void 0;t=e.viewContainerRef.createComponent(e.component,{index:e.viewContainerRef.length,injector:n,ngModuleRef:o,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),this.setDisposeFn(()=>t.destroy())}else{let n=this._appRef,o=e.injector||this._defaultInjector||_.NULL,r=o.get($t,n.injector);t=Fn(e.component,{elementInjector:o,environmentInjector:r,projectableNodes:e.projectableNodes||void 0,bindings:e.bindings||void 0}),n.attachView(t.hostView),this.setDisposeFn(()=>{n.viewCount>0&&n.detachView(t.hostView),t.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(t)),this._attachedPortal=e,t}attachTemplatePortal(e){let t=e.viewContainerRef,n=t.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return n.rootNodes.forEach(o=>this.outletElement.appendChild(o)),n.detectChanges(),this.setDisposeFn(()=>{let o=t.indexOf(n);o!==-1&&t.remove(o)}),this._attachedPortal=e,n}attachDomPortal=e=>{let t=e.element;t.parentNode;let n=this.outletElement.ownerDocument.createComment("dom-portal");t.parentNode.insertBefore(n,t),this.outletElement.appendChild(t),this._attachedPortal=e,super.setDisposeFn(()=>{n.parentNode&&n.parentNode.replaceChild(t,n)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(e){return e.hostView.rootNodes[0]}};var Tt=(()=>{class i extends pt{_moduleRef=s(Me,{optional:!0});_document=s(E);_viewContainerRef=s(Ae);_isInitialized=!1;_attachedRef=null;constructor(){super()}get portal(){return this._attachedPortal}set portal(t){this.hasAttached()&&!t&&!this._isInitialized||(this.hasAttached()&&super.detach(),t&&super.attach(t),this._attachedPortal=t||null)}attached=new V;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(t){t.setAttachedHost(this);let n=t.viewContainerRef!=null?t.viewContainerRef:this._viewContainerRef,o=n.createComponent(t.component,{index:n.length,injector:t.injector||n.injector,projectableNodes:t.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:t.bindings||void 0});return n!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=t,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(t){t.setAttachedHost(this);let n=this._viewContainerRef.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=t,this._attachedRef=n,this.attached.emit(n),n}attachDomPortal=t=>{let n=t.element;n.parentNode;let o=this._document.createComment("dom-portal");t.setAttachedHost(this),n.parentNode.insertBefore(o,n),this._getRootNode().appendChild(n),this._attachedPortal=t,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(n,o)})};_getRootNode(){let t=this._viewContainerRef.element.nativeElement;return t.nodeType===t.ELEMENT_NODE?t:t.parentNode}static \u0275fac=function(n){return new(n||i)};static \u0275dir=b({type:i,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[O]})}return i})(),et=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({})}return i})();function le(i,...e){return e.length?e.some(t=>i[t]):i.altKey||i.shiftKey||i.ctrlKey||i.metaKey}var ei=Tn();function bt(i){return new ce(i.get(Mt),i.get(E))}var ce=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(e,t){this._viewportRuler=e,this._document=t}attach(){}enable(){if(this._canBeEnabled()){let e=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=e.style.left||"",this._previousHTMLStyles.top=e.style.top||"",e.style.left=v(-this._previousScrollPosition.left),e.style.top=v(-this._previousScrollPosition.top),e.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let e=this._document.documentElement,t=this._document.body,n=e.style,o=t.style,r=n.scrollBehavior||"",a=o.scrollBehavior||"";this._isEnabled=!1,n.left=this._previousHTMLStyles.left,n.top=this._previousHTMLStyles.top,e.classList.remove("cdk-global-scrollblock"),ei&&(n.scrollBehavior=o.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),ei&&(n.scrollBehavior=r,o.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let t=this._document.documentElement,n=this._viewportRuler.getViewportSize();return t.scrollHeight>n.height||t.scrollWidth>n.width}};function li(i,e){return new de(i.get(Re),i.get(y),i.get(Mt),e)}var de=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(e,t,n,o){this._scrollDispatcher=e,this._ngZone=t,this._viewportRuler=n,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(this._scrollSubscription)return;let e=this._scrollDispatcher.scrolled(0).pipe(Q(t=>!t||!this._overlayRef.overlayElement.contains(t.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=e.subscribe(()=>{let t=this._viewportRuler.getViewportScrollPosition().top;Math.abs(t-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=e.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var Pt=class{enable(){}disable(){}attach(){}};function Ge(i,e){return e.some(t=>{let n=i.bottom<t.top,o=i.top>t.bottom,r=i.right<t.left,a=i.left>t.right;return n||o||r||a})}function ni(i,e){return e.some(t=>{let n=i.top<t.top,o=i.bottom>t.bottom,r=i.left<t.left,a=i.right>t.right;return n||o||r||a})}function ci(i,e){return new ue(i.get(Re),i.get(Mt),i.get(y),e)}var ue=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(e,t,n,o){this._scrollDispatcher=e,this._viewportRuler=t,this._ngZone=n,this._config=o}attach(e){this._overlayRef,this._overlayRef=e}enable(){if(!this._scrollSubscription){let e=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(e).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let t=this._overlayRef.overlayElement.getBoundingClientRect(),{width:n,height:o}=this._viewportRuler.getViewportSize();Ge(t,[{width:n,height:o,bottom:o,right:n,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},di=(()=>{class i{_injector=s(_);constructor(){}noop=()=>new Pt;close=t=>li(this._injector,t);block=()=>bt(this._injector);reposition=t=>ci(this._injector,t);static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),ft=class{positionStrategy;scrollStrategy=new Pt;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(e){if(e){let t=Object.keys(e);for(let n of t)e[n]!==void 0&&(this[n]=e[n])}}};var he=class{connectionPair;scrollableViewProperties;constructor(e,t){this.connectionPair=e,this.scrollableViewProperties=t}};var ui=(()=>{class i{_attachedOverlays=[];_document=s(E);_isAttached=!1;constructor(){}ngOnDestroy(){this.detach()}add(t){this.remove(t),this._attachedOverlays.push(t)}remove(t){let n=this._attachedOverlays.indexOf(t);n>-1&&this._attachedOverlays.splice(n,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(t,n,o){return o.observers.length<1?!1:t.eventPredicate?t.eventPredicate(n):!0}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),hi=(()=>{class i extends ui{_ngZone=s(y);_renderer=s(W).createRenderer(null,null);_cleanupKeydown;add(t){super.add(t),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=t=>{let n=this._attachedOverlays;for(let o=n.length-1;o>-1;o--){let r=n[o];if(this.canReceiveEvent(r,t,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(t));break}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),mi=(()=>{class i extends ui{_platform=s(A);_ngZone=s(y);_renderer=s(W).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(t){if(super.add(t),!this._isAttached){let n=this._document.body,o={capture:!0},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(n,"pointerdown",this._pointerDownListener,o),r.listen(n,"click",this._clickListener,o),r.listen(n,"auxclick",this._clickListener,o),r.listen(n,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=n.style.cursor,n.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(t=>t()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=t=>{this._pointerDownEventTarget=R(t)};_clickListener=t=>{let n=R(t),o=t.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:n;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let a=r.length-1;a>-1;a--){let l=r[a],c=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,t,c))){if(ii(l.overlayElement,n)||ii(l.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>c.next(t)):c.next(t)}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function ii(i,e){let t=typeof ShadowRoot<"u"&&ShadowRoot,n=e;for(;n;){if(n===i)return!0;n=t&&n instanceof ShadowRoot?n.host:n.parentNode}return!1}var pi=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(n,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
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
`],encapsulation:2,changeDetection:0})}return i})(),fe=(()=>{class i{_platform=s(A);_containerElement;_document=s(E);_styleLoader=s(j);constructor(){}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let t="cdk-overlay-container";if(this._platform.isBrowser||Ue()){let o=this._document.querySelectorAll(`.${t}[platform="server"], .${t}[platform="test"]`);for(let r=0;r<o.length;r++)o[r].remove()}let n=this._document.createElement("div");n.classList.add(t),Ue()?n.setAttribute("platform","test"):this._platform.isBrowser||n.setAttribute("platform","server"),this._document.body.appendChild(n),this._containerElement=n}_loadStyles(){this._styleLoader.load(pi)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),We=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(e,t,n,o){this._renderer=t,this._ngZone=n,this.element=e.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=t.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let e=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),e.style.pointerEvents="none",e.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function Ye(i){return i&&i.nodeType===1}var gt=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new g;_attachments=new g;_detachments=new g;_positionStrategy;_scrollStrategy;_locationChanges=Ee.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new g;_outsidePointerEvents=new g;_afterNextRenderRef;constructor(e,t,n,o,r,a,l,c,u,d=!1,m,k){this._portalOutlet=e,this._host=t,this._pane=n,this._config=o,this._ngZone=r,this._keyboardDispatcher=a,this._document=l,this._location=c,this._outsideClickDispatcher=u,this._animationsDisabled=d,this._injector=m,this._renderer=k,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(e){if(this._disposed)return null;this._attachHost();let t=this._portalOutlet.attach(e);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=G(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof t?.onDestroy=="function"&&t.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),t}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let e=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),e}dispose(){if(this._disposed)return;let e=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,e&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(e){e!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=e,this.hasAttached()&&(e.attach(this),this.updatePosition()))}updateSize(e){this._config=h(h({},this._config),e),this._updateElementSize()}setDirection(e){this._config=T(h({},this._config),{direction:e}),this._updateElementDirection()}addPanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!0)}removePanelClass(e){this._pane&&this._toggleClasses(this._pane,e,!1)}getDirection(){let e=this._config.direction;return e?typeof e=="string"?e:e.value:"ltr"}updateScrollStrategy(e){e!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=e,this.hasAttached()&&(e.attach(this),e.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let e=this._pane.style;e.width=v(this._config.width),e.height=v(this._config.height),e.minWidth=v(this._config.minWidth),e.minHeight=v(this._config.minHeight),e.maxWidth=v(this._config.maxWidth),e.maxHeight=v(this._config.maxHeight)}_togglePointerEvents(e){this._pane.style.pointerEvents=e?"":"none"}_attachHost(){if(!this._host.parentElement){let e=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Ye(e)?e.after(this._host):e?.type==="parent"?e.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let e="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new We(this._document,this._renderer,this._ngZone,t=>{this._backdropClick.next(t)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(e))}):this._backdropRef.element.classList.add(e)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(e,t,n){let o=ct(t||[]).filter(r=>!!r);o.length&&(n?e.classList.add(...o):e.classList.remove(...o))}_detachContentWhenEmpty(){let e=!1;try{this._detachContentAfterRenderRef=G(()=>{e=!0,this._detachContent()},{injector:this._injector})}catch(t){if(e)throw t;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let e=this._scrollStrategy;e?.disable(),e?.detach?.()}},oi="cdk-overlay-connected-position-bounding-box",To=/([A-Za-z%]+)$/;function fi(i,e){return new me(e,i.get(Mt),i.get(E),i.get(A),i.get(fe))}var me=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new g;_resizeSubscription=Ee.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(e,t,n,o,r){this._viewportRuler=t,this._document=n,this._platform=o,this._overlayContainer=r,this.setOrigin(e)}attach(e){this._overlayRef&&this._overlayRef,this._validatePositions(),e.hostElement.classList.add(oi),this._overlayRef=e,this._boundingBox=e.hostElement,this._pane=e.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let e=this._originRect,t=this._overlayRect,n=this._viewportRect,o=this._containerRect,r=[],a;for(let l of this._preferredPositions){let c=this._getOriginPoint(e,o,l),u=this._getOverlayPoint(c,t,l),d=this._getOverlayFit(u,t,n,l);if(d.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(l,c);return}if(this._canFitWithFlexibleDimensions(d,u,n)){r.push({position:l,origin:c,overlayRect:t,boundingBoxRect:this._calculateBoundingBoxRect(c,l)});continue}(!a||a.overlayFit.visibleArea<d.visibleArea)&&(a={overlayFit:d,overlayPoint:u,originPoint:c,position:l,overlayRect:t})}if(r.length){let l=null,c=-1;for(let u of r){let d=u.boundingBoxRect.width*u.boundingBoxRect.height*(u.position.weight||1);d>c&&(c=d,l=u)}this._isPushed=!1,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&nt(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(oi),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let e=this._lastPosition;e?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(e,this._getOriginPoint(this._originRect,this._containerRect,e))):this.apply()}withScrollableContainers(e){return this._scrollables=e,this}withPositions(e){return this._preferredPositions=e,e.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(e){return this._viewportMargin=e,this}withFlexibleDimensions(e=!0){return this._hasFlexibleDimensions=e,this}withGrowAfterOpen(e=!0){return this._growAfterOpen=e,this}withPush(e=!0){return this._canPush=e,this}withLockedPosition(e=!0){return this._positionLocked=e,this}setOrigin(e){return this._origin=e,this}withDefaultOffsetX(e){return this._offsetX=e,this}withDefaultOffsetY(e){return this._offsetY=e,this}withTransformOriginOn(e){return this._transformOriginSelector=e,this}withPopoverLocation(e){return this._popoverLocation=e,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof x?this._origin.nativeElement:Ye(this._origin)?this._origin:null}_getOriginPoint(e,t,n){let o;if(n.originX=="center")o=e.left+e.width/2;else{let a=this._isRtl()?e.right:e.left,l=this._isRtl()?e.left:e.right;o=n.originX=="start"?a:l}t.left<0&&(o-=t.left);let r;return n.originY=="center"?r=e.top+e.height/2:r=n.originY=="top"?e.top:e.bottom,t.top<0&&(r-=t.top),{x:o,y:r}}_getOverlayPoint(e,t,n){let o;n.overlayX=="center"?o=-t.width/2:n.overlayX==="start"?o=this._isRtl()?-t.width:0:o=this._isRtl()?0:-t.width;let r;return n.overlayY=="center"?r=-t.height/2:r=n.overlayY=="top"?0:-t.height,{x:e.x+o,y:e.y+r}}_getOverlayFit(e,t,n,o){let r=ai(t),{x:a,y:l}=e,c=this._getOffset(o,"x"),u=this._getOffset(o,"y");c&&(a+=c),u&&(l+=u);let d=0-a,m=a+r.width-n.width,k=0-l,S=l+r.height-n.height,M=this._subtractOverflows(r.width,d,m),w=this._subtractOverflows(r.height,k,S),q=M*w;return{visibleArea:q,isCompletelyWithinViewport:r.width*r.height===q,fitsInViewportVertically:w===r.height,fitsInViewportHorizontally:M==r.width}}_canFitWithFlexibleDimensions(e,t,n){if(this._hasFlexibleDimensions){let o=n.bottom-t.y,r=n.right-t.x,a=ri(this._overlayRef.getConfig().minHeight),l=ri(this._overlayRef.getConfig().minWidth),c=e.fitsInViewportVertically||a!=null&&a<=o,u=e.fitsInViewportHorizontally||l!=null&&l<=r;return c&&u}return!1}_pushOverlayOnScreen(e,t,n){if(this._previousPushAmount&&this._positionLocked)return{x:e.x+this._previousPushAmount.x,y:e.y+this._previousPushAmount.y};let o=ai(t),r=this._viewportRect,a=Math.max(e.x+o.width-r.width,0),l=Math.max(e.y+o.height-r.height,0),c=Math.max(r.top-n.top-e.y,0),u=Math.max(r.left-n.left-e.x,0),d=0,m=0;return o.width<=r.width?d=u||-a:d=e.x<this._getViewportMarginStart()?r.left-n.left-e.x:0,o.height<=r.height?m=c||-l:m=e.y<this._getViewportMarginTop()?r.top-n.top-e.y:0,this._previousPushAmount={x:d,y:m},{x:e.x+d,y:e.y+m}}_applyPosition(e,t){if(this._setTransformOrigin(e),this._setOverlayElementStyles(t,e),this._setBoundingBoxStyles(t,e),e.panelClass&&this._addPanelClasses(e.panelClass),this._positionChanges.observers.length){let n=this._getScrollVisibility();if(e!==this._lastPosition||!this._lastScrollVisibility||!Po(this._lastScrollVisibility,n)){let o=new he(e,n);this._positionChanges.next(o)}this._lastScrollVisibility=n}this._lastPosition=e,this._isInitialRender=!1}_setTransformOrigin(e){if(!this._transformOriginSelector)return;let t=this._boundingBox.querySelectorAll(this._transformOriginSelector),n,o=e.overlayY;e.overlayX==="center"?n="center":this._isRtl()?n=e.overlayX==="start"?"right":"left":n=e.overlayX==="start"?"left":"right";for(let r=0;r<t.length;r++)t[r].style.transformOrigin=`${n} ${o}`}_calculateBoundingBoxRect(e,t){let n=this._viewportRect,o=this._isRtl(),r,a,l;if(t.overlayY==="top")a=e.y,r=n.height-a+this._getViewportMarginBottom();else if(t.overlayY==="bottom")l=n.height-e.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=n.height-l+this._getViewportMarginTop();else{let S=Math.min(n.bottom-e.y+n.top,e.y),M=this._lastBoundingBoxSize.height;r=S*2,a=e.y-S,r>M&&!this._isInitialRender&&!this._growAfterOpen&&(a=e.y-M/2)}let c=t.overlayX==="start"&&!o||t.overlayX==="end"&&o,u=t.overlayX==="end"&&!o||t.overlayX==="start"&&o,d,m,k;if(u)k=n.width-e.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),d=e.x-this._getViewportMarginStart();else if(c)m=e.x,d=n.right-e.x-this._getViewportMarginEnd();else{let S=Math.min(n.right-e.x+n.left,e.x),M=this._lastBoundingBoxSize.width;d=S*2,m=e.x-S,d>M&&!this._isInitialRender&&!this._growAfterOpen&&(m=e.x-M/2)}return{top:a,left:m,bottom:l,right:k,width:d,height:r}}_setBoundingBoxStyles(e,t){let n=this._calculateBoundingBoxRect(e,t);!this._isInitialRender&&!this._growAfterOpen&&(n.height=Math.min(n.height,this._lastBoundingBoxSize.height),n.width=Math.min(n.width,this._lastBoundingBoxSize.width));let o={};if(this._hasExactPosition())o.top=o.left="0",o.bottom=o.right="auto",o.maxHeight=o.maxWidth="",o.width=o.height="100%";else{let r=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;o.width=v(n.width),o.height=v(n.height),o.top=v(n.top)||"auto",o.bottom=v(n.bottom)||"auto",o.left=v(n.left)||"auto",o.right=v(n.right)||"auto",t.overlayX==="center"?o.alignItems="center":o.alignItems=t.overlayX==="end"?"flex-end":"flex-start",t.overlayY==="center"?o.justifyContent="center":o.justifyContent=t.overlayY==="bottom"?"flex-end":"flex-start",r&&(o.maxHeight=v(r)),a&&(o.maxWidth=v(a))}this._lastBoundingBoxSize=n,nt(this._boundingBox.style,o)}_resetBoundingBoxStyles(){nt(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){nt(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(e,t){let n={},o=this._hasExactPosition(),r=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(o){let d=this._viewportRuler.getViewportScrollPosition();nt(n,this._getExactOverlayY(t,e,d)),nt(n,this._getExactOverlayX(t,e,d))}else n.position="static";let l="",c=this._getOffset(t,"x"),u=this._getOffset(t,"y");c&&(l+=`translateX(${c}px) `),u&&(l+=`translateY(${u}px)`),n.transform=l.trim(),a.maxHeight&&(o?n.maxHeight=v(a.maxHeight):r&&(n.maxHeight="")),a.maxWidth&&(o?n.maxWidth=v(a.maxWidth):r&&(n.maxWidth="")),nt(this._pane.style,n)}_getExactOverlayY(e,t,n){let o={top:"",bottom:""},r=this._getOverlayPoint(t,this._overlayRect,e);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,n)),e.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;o.bottom=`${a-(r.y+this._overlayRect.height)}px`}else o.top=v(r.y);return o}_getExactOverlayX(e,t,n){let o={left:"",right:""},r=this._getOverlayPoint(t,this._overlayRect,e);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,n));let a;if(this._isRtl()?a=e.overlayX==="end"?"left":"right":a=e.overlayX==="end"?"right":"left",a==="right"){let l=this._document.documentElement.clientWidth;o.right=`${l-(r.x+this._overlayRect.width)}px`}else o.left=v(r.x);return o}_getScrollVisibility(){let e=this._getOriginRect(),t=this._pane.getBoundingClientRect(),n=this._scrollables.map(o=>o.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:ni(e,n),isOriginOutsideView:Ge(e,n),isOverlayClipped:ni(t,n),isOverlayOutsideView:Ge(t,n)}}_subtractOverflows(e,...t){return t.reduce((n,o)=>n-Math.max(o,0),e)}_getNarrowedViewportRect(){let e=this._document.documentElement.clientWidth,t=this._document.documentElement.clientHeight,n=this._viewportRuler.getViewportScrollPosition();return{top:n.top+this._getViewportMarginTop(),left:n.left+this._getViewportMarginStart(),right:n.left+e-this._getViewportMarginEnd(),bottom:n.top+t-this._getViewportMarginBottom(),width:e-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:t-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(e,t){return t==="x"?e.offsetX==null?this._offsetX:e.offsetX:e.offsetY==null?this._offsetY:e.offsetY}_validatePositions(){}_addPanelClasses(e){this._pane&&ct(e).forEach(t=>{t!==""&&this._appliedPanelClasses.indexOf(t)===-1&&(this._appliedPanelClasses.push(t),this._pane.classList.add(t))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(e=>{this._pane.classList.remove(e)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let e=this._origin;if(e instanceof x)return e.nativeElement.getBoundingClientRect();if(e instanceof Element)return e.getBoundingClientRect();let t=e.width||0,n=e.height||0;return{top:e.y,bottom:e.y+n,left:e.x,right:e.x+t,height:n,width:t}}_getContainerRect(){let e=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",t=this._overlayContainer.getContainerElement();e&&(t.style.display="block");let n=t.getBoundingClientRect();return e&&(t.style.display=""),n}};function nt(i,e){for(let t in e)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function ri(i){if(typeof i!="number"&&i!=null){let[e,t]=i.split(To);return!t||t==="px"?parseFloat(e):null}return i||null}function ai(i){return{top:Math.floor(i.top),right:Math.floor(i.right),bottom:Math.floor(i.bottom),left:Math.floor(i.left),width:Math.floor(i.width),height:Math.floor(i.height)}}function Po(i,e){return i===e?!0:i.isOriginClipped===e.isOriginClipped&&i.isOriginOutsideView===e.isOriginOutsideView&&i.isOverlayClipped===e.isOverlayClipped&&i.isOverlayOutsideView===e.isOverlayOutsideView}var si="cdk-global-overlay-wrapper";function _t(i){return new pe}var pe=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(e){let t=e.getConfig();this._overlayRef=e,this._width&&!t.width&&e.updateSize({width:this._width}),this._height&&!t.height&&e.updateSize({height:this._height}),e.hostElement.classList.add(si),this._isDisposed=!1}top(e=""){return this._bottomOffset="",this._topOffset=e,this._alignItems="flex-start",this}left(e=""){return this._xOffset=e,this._xPosition="left",this}bottom(e=""){return this._topOffset="",this._bottomOffset=e,this._alignItems="flex-end",this}right(e=""){return this._xOffset=e,this._xPosition="right",this}start(e=""){return this._xOffset=e,this._xPosition="start",this}end(e=""){return this._xOffset=e,this._xPosition="end",this}width(e=""){return this._overlayRef?this._overlayRef.updateSize({width:e}):this._width=e,this}height(e=""){return this._overlayRef?this._overlayRef.updateSize({height:e}):this._height=e,this}centerHorizontally(e=""){return this.left(e),this._xPosition="center",this}centerVertically(e=""){return this.top(e),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement.style,n=this._overlayRef.getConfig(),{width:o,height:r,maxWidth:a,maxHeight:l}=n,c=(o==="100%"||o==="100vw")&&(!a||a==="100%"||a==="100vw"),u=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),d=this._xPosition,m=this._xOffset,k=this._overlayRef.getConfig().direction==="rtl",S="",M="",w="";c?w="flex-start":d==="center"?(w="center",k?M=m:S=m):k?d==="left"||d==="end"?(w="flex-end",S=m):(d==="right"||d==="start")&&(w="flex-start",M=m):d==="left"||d==="start"?(w="flex-start",S=m):(d==="right"||d==="end")&&(w="flex-end",M=m),e.position=this._cssPosition,e.marginLeft=c?"0":S,e.marginTop=u?"0":this._topOffset,e.marginBottom=this._bottomOffset,e.marginRight=c?"0":M,t.justifyContent=w,t.alignItems=u?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let e=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement,n=t.style;t.classList.remove(si),n.justifyContent=n.alignItems=e.marginTop=e.marginBottom=e.marginLeft=e.marginRight=e.position="",this._overlayRef=null,this._isDisposed=!0}},gi=(()=>{class i{_injector=s(_);constructor(){}global(){return _t()}flexibleConnectedTo(t){return fi(this._injector,t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),bi=new f("OVERLAY_DEFAULT_CONFIG");function ge(i,e){i.get(j).load(pi);let t=i.get(fe),n=i.get(E),o=i.get(Z),r=i.get(Oe),a=i.get(At),l=i.get(H,null,{optional:!0})||i.get(W).createRenderer(null,null),c=new ft(e),u=i.get(bi,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||a.value,"showPopover"in n.body?c.usePopover=e?.usePopover??u:c.usePopover=!1;let d=n.createElement("div"),m=n.createElement("div");d.id=o.getId("cdk-overlay-"),d.classList.add("cdk-overlay-pane"),m.appendChild(d),c.usePopover&&(m.setAttribute("popover","manual"),m.classList.add("cdk-overlay-popover"));let k=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return Ye(k)?k.after(m):k?.type==="parent"?k.element.appendChild(m):t.getContainerElement().appendChild(m),new gt(new se(d,r,i),m,d,c,i.get(y),i.get(hi),n,i.get(Rn),i.get(mi),e?.disableAnimations??i.get(Xt,null,{optional:!0})==="NoopAnimations",i.get($t),l)}var _i=(()=>{class i{scrollStrategies=s(di);_positionBuilder=s(gi);_injector=s(_);constructor(){}create(t){return ge(this._injector,t)}position(){return this._positionBuilder}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Vt=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({providers:[_i],imports:[X,et,Te,Te]})}return i})();var Nt;function vi(){if(Nt==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>Nt=!0}))}finally{Nt=Nt||!1}return Nt}function vt(i){return vi()?i:!!i.capture}var yi=new f("cdk-input-modality-detector-options"),Ci={ignoreKeys:[18,17,224,91,16]},Di=650,$e={passive:!0,capture:!0},wi=(()=>{class i{_platform=s(A);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new un(null);_options;_lastTouchMs=0;_onKeydown=t=>{this._options?.ignoreKeys?.some(n=>n===t.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=R(t))};_onMousedown=t=>{Date.now()-this._lastTouchMs<Di||(this._modality.next(Et(t)?"keyboard":"mouse"),this._mostRecentTarget=R(t))};_onTouchstart=t=>{if(xt(t)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=R(t)};constructor(){let t=s(y),n=s(E),o=s(yi,{optional:!0});if(this._options=h(h({},Ci),o),this.modalityDetected=this._modality.pipe(Gt(1)),this.modalityChanged=this.modalityDetected.pipe(vn()),this._platform.isBrowser){let r=s(W).createRenderer(null,null);this._listenerCleanups=t.runOutsideAngular(()=>[r.listen(n,"keydown",this._onKeydown,$e),r.listen(n,"mousedown",this._onMousedown,$e),r.listen(n,"touchstart",this._onTouchstart,$e)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(t=>t())}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Lt=(function(i){return i[i.IMMEDIATE=0]="IMMEDIATE",i[i.EVENTUAL=1]="EVENTUAL",i})(Lt||{}),Ei=new f("cdk-focus-monitor-default-options"),be=vt({passive:!0,capture:!0}),Bt=(()=>{class i{_ngZone=s(y);_platform=s(A);_inputModalityDetector=s(wi);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=s(E);_stopInputModalityDetector=new g;constructor(){let t=s(Ei,{optional:!0});this._detectionMode=t?.detectionMode||Lt.IMMEDIATE}_rootNodeFocusAndBlurListener=t=>{let n=R(t);for(let o=n;o;o=o.parentElement)t.type==="focus"?this._onFocus(t,o):this._onBlur(t,o)};monitor(t,n=!1){let o=$(t);if(!this._platform.isBrowser||o.nodeType!==1)return mn();let r=Fe(o)||this._document,a=this._elementInfo.get(o);if(a)return n&&(a.checkChildren=!0),a.subject;let l={checkChildren:n,subject:new g,rootNode:r};return this._elementInfo.set(o,l),this._registerGlobalListeners(l),l.subject}stopMonitoring(t){let n=$(t),o=this._elementInfo.get(n);o&&(o.subject.complete(),this._setClasses(n),this._elementInfo.delete(n),this._removeGlobalListeners(o))}focusVia(t,n,o){let r=$(t),a=this._document.activeElement;r===a?this._getClosestElementsInfo(r).forEach(([l,c])=>this._originChanged(l,n,c)):(this._setOrigin(n),typeof r.focus=="function"&&r.focus(o))}ngOnDestroy(){this._elementInfo.forEach((t,n)=>this.stopMonitoring(n))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(t){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(t)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:t&&this._isLastInteractionFromInputLabel(t)?"mouse":"program"}_shouldBeAttributedToTouch(t){return this._detectionMode===Lt.EVENTUAL||!!t?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(t,n){t.classList.toggle("cdk-focused",!!n),t.classList.toggle("cdk-touch-focused",n==="touch"),t.classList.toggle("cdk-keyboard-focused",n==="keyboard"),t.classList.toggle("cdk-mouse-focused",n==="mouse"),t.classList.toggle("cdk-program-focused",n==="program")}_setOrigin(t,n=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=t,this._originFromTouchInteraction=t==="touch"&&n,this._detectionMode===Lt.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?Di:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(t,n){let o=this._elementInfo.get(n),r=R(t);!o||!o.checkChildren&&n!==r||this._originChanged(n,this._getFocusOrigin(r),o)}_onBlur(t,n){let o=this._elementInfo.get(n);!o||o.checkChildren&&t.relatedTarget instanceof Node&&n.contains(t.relatedTarget)||(this._setClasses(n),this._emitOrigin(o,null))}_emitOrigin(t,n){t.subject.observers.length&&this._ngZone.run(()=>t.subject.next(n))}_registerGlobalListeners(t){if(!this._platform.isBrowser)return;let n=t.rootNode,o=this._rootNodeFocusListenerCount.get(n)||0;o||this._ngZone.runOutsideAngular(()=>{n.addEventListener("focus",this._rootNodeFocusAndBlurListener,be),n.addEventListener("blur",this._rootNodeFocusAndBlurListener,be)}),this._rootNodeFocusListenerCount.set(n,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(Wt(this._stopInputModalityDetector)).subscribe(r=>{this._setOrigin(r,!0)}))}_removeGlobalListeners(t){let n=t.rootNode;if(this._rootNodeFocusListenerCount.has(n)){let o=this._rootNodeFocusListenerCount.get(n);o>1?this._rootNodeFocusListenerCount.set(n,o-1):(n.removeEventListener("focus",this._rootNodeFocusAndBlurListener,be),n.removeEventListener("blur",this._rootNodeFocusAndBlurListener,be),this._rootNodeFocusListenerCount.delete(n))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(t,n,o){this._setClasses(t,n),this._emitOrigin(o,n),this._lastFocusOrigin=n}_getClosestElementsInfo(t){let n=[];return this._elementInfo.forEach((o,r)=>{(r===t||o.checkChildren&&r.contains(t))&&n.push([r,o])}),n}_isLastInteractionFromInputLabel(t){let{_mostRecentTarget:n,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!n||n===t||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA"||t.disabled)return!1;let r=t.labels;if(r){for(let a=0;a<r.length;a++)if(r[a].contains(n))return!0}return!1}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var xi=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(n,o){},styles:[`.cdk-visually-hidden {
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
`],encapsulation:2,changeDetection:0})}return i})();var Ai=new Set,it,_e=(()=>{class i{_platform=s(A);_nonce=s(yn,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):No}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&Vo(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Vo(i,e){if(!Ai.has(i))try{it||(it=document.createElement("style"),e&&it.setAttribute("nonce",e),it.setAttribute("type","text/css"),document.head.appendChild(it)),it.sheet&&(it.sheet.insertRule(`@media ${i} {body{ }}`,0),Ai.add(i))}catch(t){console.error(t)}}function No(i){return{matches:i==="all"||i==="",media:i,addListener:()=>{},removeListener:()=>{}}}var Xe=(()=>{class i{_mediaMatcher=s(_e);_zone=s(y);_queries=new Map;_destroySubject=new g;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return Mi(ct(t)).some(o=>this._registerQuery(o).mql.matches)}observe(t){let o=Mi(ct(t)).map(a=>this._registerQuery(a).observable),r=pn(o);return r=fn(r.pipe(z(1)),r.pipe(Gt(1),_n(0))),r.pipe(yt(a=>{let l={matches:!1,breakpoints:{}};return a.forEach(({matches:c,query:u})=>{l.matches=l.matches||c,l.breakpoints[u]=c}),l}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);let n=this._mediaMatcher.matchMedia(t),r={observable:new dn(a=>{let l=c=>this._zone.run(()=>a.next(c));return n.addListener(l),()=>{n.removeListener(l)}}).pipe(at(n),yt(({matches:a})=>({query:t,matches:a})),Wt(this._destroySubject)),mql:n};return this._queries.set(t,r),r}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Mi(i){return i.map(e=>e.split(",")).reduce((e,t)=>e.concat(t)).map(e=>e.trim())}var Lo=(()=>{class i{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Oi=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({providers:[Lo]})}return i})();var qe=(()=>{class i{_platform=s(A);constructor(){}isDisabled(t){return t.hasAttribute("disabled")}isVisible(t){return jo(t)&&getComputedStyle(t).visibility==="visible"}isTabbable(t){if(!this._platform.isBrowser)return!1;let n=Bo(Xo(t));if(n&&(ki(n)===-1||!this.isVisible(n)))return!1;let o=t.nodeName.toLowerCase(),r=ki(t);return t.hasAttribute("contenteditable")?r!==-1:o==="iframe"||o==="object"||this._platform.WEBKIT&&this._platform.IOS&&!Yo(t)?!1:o==="audio"?t.hasAttribute("controls")?r!==-1:!1:o==="video"?r===-1?!1:r!==null?!0:this._platform.FIREFOX||t.hasAttribute("controls"):t.tabIndex>=0}isFocusable(t,n){return $o(t)&&!this.isDisabled(t)&&(n?.ignoreVisibility||this.isVisible(t))}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Bo(i){try{return i.frameElement}catch{return null}}function jo(i){return!!(i.offsetWidth||i.offsetHeight||typeof i.getClientRects=="function"&&i.getClientRects().length)}function Ho(i){let e=i.nodeName.toLowerCase();return e==="input"||e==="select"||e==="button"||e==="textarea"}function Uo(i){return Go(i)&&i.type=="hidden"}function zo(i){return Wo(i)&&i.hasAttribute("href")}function Go(i){return i.nodeName.toLowerCase()=="input"}function Wo(i){return i.nodeName.toLowerCase()=="a"}function Fi(i){if(!i.hasAttribute("tabindex")||i.tabIndex===void 0)return!1;let e=i.getAttribute("tabindex");return!!(e&&!isNaN(parseInt(e,10)))}function ki(i){if(!Fi(i))return null;let e=parseInt(i.getAttribute("tabindex")||"",10);return isNaN(e)?-1:e}function Yo(i){let e=i.nodeName.toLowerCase(),t=e==="input"&&i.type;return t==="text"||t==="password"||e==="select"||e==="textarea"}function $o(i){return Uo(i)?!1:Ho(i)||zo(i)||i.hasAttribute("contenteditable")||Fi(i)}function Xo(i){return i.ownerDocument&&i.ownerDocument.defaultView||window}var Ke=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>this.focusLastTabbableElement();endAnchorListener=()=>this.focusFirstTabbableElement();get enabled(){return this._enabled}set enabled(e){this._enabled=e,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_enabled=!0;constructor(e,t,n,o,r=!1,a){this._element=e,this._checker=t,this._ngZone=n,this._document=o,this._injector=a,r||this.attachAnchors()}destroy(){let e=this._startAnchor,t=this._endAnchor;e&&(e.removeEventListener("focus",this.startAnchorListener),e.remove()),t&&(t.removeEventListener("focus",this.endAnchorListener),t.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusInitialElement(e)))})}focusFirstTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusFirstTabbableElement(e)))})}focusLastTabbableElementWhenReady(e){return new Promise(t=>{this._executeOnStable(()=>t(this.focusLastTabbableElement(e)))})}_getRegionBoundary(e){let t=this._element.querySelectorAll(`[cdk-focus-region-${e}], [cdkFocusRegion${e}], [cdk-focus-${e}]`);return e=="start"?t.length?t[0]:this._getFirstTabbableElement(this._element):t.length?t[t.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(e){let t=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(t){if(!this._checker.isFocusable(t)){let n=this._getFirstTabbableElement(t);return n?.focus(e),!!n}return t.focus(e),!0}return this.focusFirstTabbableElement(e)}focusFirstTabbableElement(e){let t=this._getRegionBoundary("start");return t&&t.focus(e),!!t}focusLastTabbableElement(e){let t=this._getRegionBoundary("end");return t&&t.focus(e),!!t}hasAttached(){return this._hasAttached}_getFirstTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let n=0;n<t.length;n++){let o=t[n].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(t[n]):null;if(o)return o}return null}_getLastTabbableElement(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;let t=e.children;for(let n=t.length-1;n>=0;n--){let o=t[n].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(t[n]):null;if(o)return o}return null}_createAnchor(){let e=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,e),e.classList.add("cdk-visually-hidden"),e.classList.add("cdk-focus-trap-anchor"),e.setAttribute("aria-hidden","true"),e}_toggleAnchorTabIndex(e,t){e?t.setAttribute("tabindex","0"):t.removeAttribute("tabindex")}toggleAnchors(e){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}_executeOnStable(e){this._injector?G(e,{injector:this._injector}):setTimeout(e)}},Ri=(()=>{class i{_checker=s(qe);_ngZone=s(y);_document=s(E);_injector=s(_);constructor(){s(j).load(xi)}create(t,n=!1){return new Ke(t,this._checker,this._ngZone,this._document,n,this._injector)}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var ot=(function(i){return i[i.NONE=0]="NONE",i[i.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",i[i.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",i})(ot||{}),Si="cdk-high-contrast-black-on-white",Ii="cdk-high-contrast-white-on-black",Ze="cdk-high-contrast-active",Zo=(()=>{class i{_platform=s(A);_hasCheckedHighContrastMode=!1;_document=s(E);_breakpointSubscription;constructor(){this._breakpointSubscription=s(Xe).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return ot.NONE;let t=this._document.createElement("div");t.style.backgroundColor="rgb(1,2,3)",t.style.position="absolute",this._document.body.appendChild(t);let n=this._document.defaultView||window,o=n&&n.getComputedStyle?n.getComputedStyle(t):null,r=(o&&o.backgroundColor||"").replace(/ /g,"");switch(t.remove(),r){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return ot.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return ot.BLACK_ON_WHITE}return ot.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let t=this._document.body.classList;t.remove(Ze,Si,Ii),this._hasCheckedHighContrastMode=!0;let n=this.getHighContrastMode();n===ot.BLACK_ON_WHITE?t.add(Ze,Si):n===ot.WHITE_ON_BLACK&&t.add(Ze,Ii)}}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Ti=(()=>{class i{constructor(){s(Zo)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({imports:[Oi]})}return i})();function Ko(i,e){}var K=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext};var Je=(()=>{class i extends pt{_elementRef=s(x);_focusTrapFactory=s(Ri);_config;_interactivityChecker=s(qe);_ngZone=s(y);_focusMonitor=s(Bt);_renderer=s(H);_changeDetectorRef=s(te);_injector=s(_);_platform=s(A);_document=s(E);_portalOutlet;_focusTrapped=new g;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=s(K,{optional:!0})||new K,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(t){this._ariaLabelledByQueue.push(t),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(t){let n=this._ariaLabelledByQueue.indexOf(t);n>-1&&(this._ariaLabelledByQueue.splice(n,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(t){this._portalOutlet.hasAttached();let n=this._portalOutlet.attachComponentPortal(t);return this._contentAttached(),n}attachTemplatePortal(t){this._portalOutlet.hasAttached();let n=this._portalOutlet.attachTemplatePortal(t);return this._contentAttached(),n}attachDomPortal=t=>{this._portalOutlet.hasAttached();let n=this._portalOutlet.attachDomPortal(t);return this._contentAttached(),n};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(t,n){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{r(),a(),t.removeAttribute("tabindex")},r=this._renderer.listen(t,"blur",o),a=this._renderer.listen(t,"mousedown",o)})),t.focus(n)}_focusByCssSelector(t,n){let o=this._elementRef.nativeElement.querySelector(t);o&&this._forceFocus(o,n)}_trapFocus(t){this._isDestroyed||G(()=>{let n=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||n.focus(t);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(t)||this._focusDialogContainer(t);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',t);break;default:this._focusByCssSelector(this._config.autoFocus,t);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let t=this._config.restoreFocus,n=null;if(typeof t=="string"?n=this._document.querySelector(t):typeof t=="boolean"?n=t?this._elementFocusedBeforeDialogWasOpened:null:t&&(n=t),this._config.restoreFocus&&n&&typeof n.focus=="function"){let o=wt(),r=this._elementRef.nativeElement;(!o||o===this._document.body||o===r||r.contains(o))&&(this._focusMonitor?(this._focusMonitor.focusVia(n,this._closeInteractionType),this._closeInteractionType=null):n.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(t){this._elementRef.nativeElement.focus?.(t)}_containsFocus(){let t=this._elementRef.nativeElement,n=wt();return t===n||t.contains(n)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=wt()))}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["cdk-dialog-container"]],viewQuery:function(n,o){if(n&1&&Mn(Tt,7),n&2){let r;On(r=kn())&&(o._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(n,o){n&2&&Y("id",o._config.id||null)("role",o._config.role)("aria-modal",o._config.ariaModal)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null)},features:[O],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(n,o){n&1&&Kt(0,Ko,0,0,"ng-template",0)},dependencies:[Tt],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2})}return i})(),jt=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new g;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(e,t){this.overlayRef=e,this.config=t,this.disableClose=t.disableClose,this.backdropClick=e.backdropClick(),this.keydownEvents=e.keydownEvents(),this.outsidePointerEvents=e.outsidePointerEvents(),this.id=t.id,this.keydownEvents.subscribe(n=>{n.keyCode===27&&!this.disableClose&&!le(n)&&(n.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=e.detachments().subscribe(()=>{t.closeOnOverlayDetachments!==!1&&this.close()})}close(e,t){if(this._canClose(e)){let n=this.closed;this.containerInstance._closeInteractionType=t?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),n.next(e),n.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(e="",t=""){return this.overlayRef.updateSize({width:e,height:t}),this}addPanelClass(e){return this.overlayRef.addPanelClass(e),this}removePanelClass(e){return this.overlayRef.removePanelClass(e),this}_canClose(e){let t=this.config;return!!this.containerInstance&&(!t.closePredicate||t.closePredicate(e,t,this.componentInstance))}},qo=new f("DialogScrollStrategy",{providedIn:"root",factory:()=>{let i=s(_);return()=>bt(i)}}),Qo=new f("DialogData"),Jo=new f("DefaultDialogConfig");function tr(i){let e=st(i),t=new V;return{valueSignal:e,get value(){return e()},change:t,ngOnDestroy(){t.complete()}}}var tn=(()=>{class i{_injector=s(_);_defaultOptions=s(Jo,{optional:!0});_parentDialog=s(i,{optional:!0,skipSelf:!0});_overlayContainer=s(fe);_idGenerator=s(Z);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new g;_afterOpenedAtThisLevel=new g;_ariaHiddenElements=new Map;_scrollStrategy=s(qo);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=zt(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(at(void 0)));constructor(){}open(t,n){let o=this._defaultOptions||new K;n=h(h({},o),n),n.id=n.id||this._idGenerator.getId("cdk-dialog-"),n.id&&this.getDialogById(n.id);let r=this._getOverlayConfig(n),a=ge(this._injector,r),l=new jt(a,n),c=this._attachContainer(a,l,n);if(l.containerInstance=c,!this.openDialogs.length){let u=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(z(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(u)}):this._hideNonDialogContentFromAssistiveTechnology(u)}return this._attachDialogContent(t,l,c,n),this.openDialogs.push(l),l.closed.subscribe(()=>this._removeOpenDialog(l,!0)),this.afterOpened.next(l),l}closeAll(){Qe(this.openDialogs,t=>t.close())}getDialogById(t){return this.openDialogs.find(n=>n.id===t)}ngOnDestroy(){Qe(this._openDialogsAtThisLevel,t=>{t.config.closeOnDestroy===!1&&this._removeOpenDialog(t,!1)}),Qe(this._openDialogsAtThisLevel,t=>t.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(t){let n=new ft({positionStrategy:t.positionStrategy||_t().centerHorizontally().centerVertically(),scrollStrategy:t.scrollStrategy||this._scrollStrategy(),panelClass:t.panelClass,hasBackdrop:t.hasBackdrop,direction:t.direction,minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight,width:t.width,height:t.height,disposeOnNavigation:t.closeOnNavigation,disableAnimations:t.disableAnimations});return t.backdropClass&&(n.backdropClass=t.backdropClass),n}_attachContainer(t,n,o){let r=o.injector||o.viewContainerRef?.injector,a=[{provide:K,useValue:o},{provide:jt,useValue:n},{provide:gt,useValue:t}],l;o.container?typeof o.container=="function"?l=o.container:(l=o.container.type,a.push(...o.container.providers(o))):l=Je;let c=new ht(l,o.viewContainerRef,_.create({parent:r||this._injector,providers:a}));return t.attach(c).instance}_attachDialogContent(t,n,o,r){if(t instanceof Zt){let a=this._createInjector(r,n,o,void 0),l={$implicit:r.data,dialogRef:n};r.templateContext&&(l=h(h({},l),typeof r.templateContext=="function"?r.templateContext():r.templateContext)),o.attachTemplatePortal(new mt(t,null,l,a))}else{let a=this._createInjector(r,n,o,this._injector),l=o.attachComponentPortal(new ht(t,r.viewContainerRef,a));n.componentRef=l,n.componentInstance=l.instance}}_createInjector(t,n,o,r){let a=t.injector||t.viewContainerRef?.injector,l=[{provide:Qo,useValue:t.data},{provide:jt,useValue:n}];return t.providers&&(typeof t.providers=="function"?l.push(...t.providers(n,t,o)):l.push(...t.providers)),t.direction&&(!a||!a.get(At,null,{optional:!0}))&&l.push({provide:At,useValue:tr(t.direction)}),_.create({parent:a||r,providers:l})}_removeOpenDialog(t,n){let o=this.openDialogs.indexOf(t);o>-1&&(this.openDialogs.splice(o,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((r,a)=>{r?a.setAttribute("aria-hidden",r):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),n&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(t){if(t.parentElement){let n=t.parentElement.children;for(let o=n.length-1;o>-1;o--){let r=n[o];r!==t&&r.nodeName!=="SCRIPT"&&r.nodeName!=="STYLE"&&!r.hasAttribute("aria-live")&&!r.hasAttribute("popover")&&(this._ariaHiddenElements.set(r,r.getAttribute("aria-hidden")),r.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Qe(i,e){let t=i.length;for(;t--;)e(i[t])}var Vi=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({providers:[tn],imports:[Vt,et,Ti,et]})}return i})();var er=new f("MATERIAL_ANIMATIONS"),Ni=null;function nr(){return s(er,{optional:!0})?.animationsDisabled||s(Xt,{optional:!0})==="NoopAnimations"?"di-disabled":(Ni??=s(_e).matchMedia("(prefers-reduced-motion)").matches,Ni?"reduced-motion":"enabled")}function rt(){return nr()!=="enabled"}function ir(i,e){}var ye=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration},en="mdc-dialog--open",Li="mdc-dialog--opening",Bi="mdc-dialog--closing",or=150,rr=75,ar=(()=>{class i extends Je{_animationStateChanged=new V;_animationsEnabled=!rt();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?Hi(this._config.enterAnimationDuration)??or:0;_exitAnimationDuration=this._animationsEnabled?Hi(this._config.exitAnimationDuration)??rr:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(ji,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Li,en)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(en),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(en),this._animationsEnabled?(this._hostElement.style.setProperty(ji,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Bi)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(t){this._actionSectionCount+=t,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(Li,Bi)}_waitForAnimationToComplete(t,n){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(n,t)}_requestAnimationFrame(t){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(t):t()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(t){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:t})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(t){let n=super.attachComponentPortal(t);return n.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),n}static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275cmp=I({type:i,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(n,o){n&2&&(ke("id",o._config.id),Y("aria-modal",o._config.ariaModal)("role",o._config.role)("aria-labelledby",o._config.ariaLabel?null:o._ariaLabelledByQueue[0])("aria-label",o._config.ariaLabel)("aria-describedby",o._config.ariaDescribedBy||null),B("_mat-animation-noopable",!o._animationsEnabled)("mat-mdc-dialog-container-with-actions",o._actionSectionCount>0))},features:[O],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(n,o){n&1&&(wn(0,"div",0)(1,"div",1),Kt(2,ir,0,0,"ng-template",2),En()())},dependencies:[Tt],styles:[`.mat-mdc-dialog-container {
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
`],encapsulation:2})}return i})(),ji="--mat-dialog-transition-duration";function Hi(i){return i==null?null:typeof i=="number"?i:i.endsWith("ms")?ee(i.substring(0,i.length-2)):i.endsWith("s")?ee(i.substring(0,i.length-1))*1e3:i==="0"?0:null}var ve=(function(i){return i[i.OPEN=0]="OPEN",i[i.CLOSING=1]="CLOSING",i[i.CLOSED=2]="CLOSED",i})(ve||{}),Ht=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new xe(1);_beforeClosed=new xe(1);_result;_closeFallbackTimeout;_state=ve.OPEN;_closeInteractionType;constructor(e,t,n){this._ref=e,this._config=t,this._containerInstance=n,this.disableClose=t.disableClose,this.id=e.id,e.addPanelClass("mat-mdc-dialog-panel"),n._animationStateChanged.pipe(Q(o=>o.state==="opened"),z(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),n._animationStateChanged.pipe(Q(o=>o.state==="closed"),z(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),e.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),bn(this.backdropClick(),this.keydownEvents().pipe(Q(o=>o.keyCode===27&&!this.disableClose&&!le(o)))).subscribe(o=>{this.disableClose||(o.preventDefault(),Ui(this,o.type==="keydown"?"keyboard":"mouse"))})}close(e){let t=this._config.closePredicate;t&&!t(e,this._config,this.componentInstance)||(this._result=e,this._containerInstance._animationStateChanged.pipe(Q(n=>n.state==="closing"),z(1)).subscribe(n=>{this._beforeClosed.next(e),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),n.totalTime+100)}),this._state=ve.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(e){let t=this._ref.config.positionStrategy;return e&&(e.left||e.right)?e.left?t.left(e.left):t.right(e.right):t.centerHorizontally(),e&&(e.top||e.bottom)?e.top?t.top(e.top):t.bottom(e.bottom):t.centerVertically(),this._ref.updatePosition(),this}updateSize(e="",t=""){return this._ref.updateSize(e,t),this}addPanelClass(e){return this._ref.addPanelClass(e),this}removePanelClass(e){return this._ref.removePanelClass(e),this}getState(){return this._state}_finishDialogClose(){this._state=ve.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function Ui(i,e,t){return i._closeInteractionType=e,i.close(t)}var sr=new f("MatMdcDialogData"),lr=new f("mat-mdc-dialog-default-options"),cr=new f("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let i=s(_);return()=>bt(i)}}),nn=(()=>{class i{_defaultOptions=s(lr,{optional:!0});_scrollStrategy=s(cr);_parentDialog=s(i,{optional:!0,skipSelf:!0});_idGenerator=s(Z);_injector=s(_);_dialog=s(tn);_animationsDisabled=rt();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new g;_afterOpenedAtThisLevel=new g;dialogConfigClass=ye;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=zt(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(at(void 0)));constructor(){this._dialogRefConstructor=Ht,this._dialogContainerType=ar,this._dialogDataToken=sr}open(t,n){let o;n=h(h({},this._defaultOptions||new ye),n),n.id=n.id||this._idGenerator.getId("mat-mdc-dialog-"),n.scrollStrategy=n.scrollStrategy||this._scrollStrategy();let r=this._dialog.open(t,T(h({},n),{positionStrategy:_t(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||n.enterAnimationDuration?.toLocaleString()==="0"||n.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:n},{provide:K,useValue:n}]},templateContext:()=>({dialogRef:o}),providers:(a,l,c)=>(o=new this._dialogRefConstructor(a,n,c),o.updatePosition(n?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:l.data},{provide:this._dialogRefConstructor,useValue:o}])}));return o.componentRef=r.componentRef,o.componentInstance=r.componentInstance,this.openDialogs.push(o),this.afterOpened.next(o),o.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(o);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),o}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(t){return this.openDialogs.find(n=>n.id===t)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(t){let n=t.length;for(;n--;)t[n].close()}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),wl=(()=>{class i{dialogRef=s(Ht,{optional:!0});_elementRef=s(x);_dialog=s(nn);ariaLabel;type="button";dialogResult;_matDialogClose;constructor(){}ngOnInit(){this.dialogRef||(this.dialogRef=Gi(this._elementRef,this._dialog.openDialogs))}ngOnChanges(t){let n=t._matDialogClose||t._matDialogCloseResult;n&&(this.dialogResult=n.currentValue)}_onButtonClick(t){Ui(this.dialogRef,t.screenX===0&&t.screenY===0?"keyboard":"mouse",this.dialogResult)}static \u0275fac=function(n){return new(n||i)};static \u0275dir=b({type:i,selectors:[["","mat-dialog-close",""],["","matDialogClose",""]],hostVars:2,hostBindings:function(n,o){n&1&&Ct("click",function(a){return o._onButtonClick(a)}),n&2&&Y("aria-label",o.ariaLabel||null)("type",o.type)},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],type:"type",dialogResult:[0,"mat-dialog-close","dialogResult"],_matDialogClose:[0,"matDialogClose","_matDialogClose"]},exportAs:["matDialogClose"],features:[lt]})}return i})(),zi=(()=>{class i{_dialogRef=s(Ht,{optional:!0});_elementRef=s(x);_dialog=s(nn);constructor(){}ngOnInit(){this._dialogRef||(this._dialogRef=Gi(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(n){return new(n||i)};static \u0275dir=b({type:i})}return i})(),El=(()=>{class i extends zi{id=s(Z).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275dir=b({type:i,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(n,o){n&2&&ke("id",o.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[O]})}return i})(),xl=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275dir=b({type:i,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[Cn([Pn])]})}return i})(),Al=(()=>{class i extends zi{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let t;return function(o){return(t||(t=L(i)))(o||i)}})();static \u0275dir=b({type:i,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(n,o){n&2&&B("mat-mdc-dialog-actions-align-start",o.align==="start")("mat-mdc-dialog-actions-align-center",o.align==="center")("mat-mdc-dialog-actions-align-end",o.align==="end")},inputs:{align:"align"},features:[O]})}return i})();function Gi(i,e){let t=i.nativeElement.parentElement;for(;t&&!t.classList.contains("mat-mdc-dialog-container");)t=t.parentElement;return t?e.find(n=>n.id===t.id):null}var Ml=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({providers:[nn],imports:[Vi,Vt,et,X]})}return i})();var N=(function(i){return i[i.FADING_IN=0]="FADING_IN",i[i.VISIBLE=1]="VISIBLE",i[i.FADING_OUT=2]="FADING_OUT",i[i.HIDDEN=3]="HIDDEN",i})(N||{}),on=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=N.HIDDEN;constructor(e,t,n,o=!1){this._renderer=e,this.element=t,this.config=n,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},Wi=vt({passive:!0,capture:!0}),rn=class{_events=new Map;addHandler(e,t,n,o){let r=this._events.get(t);if(r){let a=r.get(n);a?a.add(o):r.set(n,new Set([o]))}else this._events.set(t,new Map([[n,new Set([o])]])),e.runOutsideAngular(()=>{document.addEventListener(t,this._delegateEventHandler,Wi)})}removeHandler(e,t,n){let o=this._events.get(e);if(!o)return;let r=o.get(t);r&&(r.delete(n),r.size===0&&o.delete(t),o.size===0&&(this._events.delete(e),document.removeEventListener(e,this._delegateEventHandler,Wi)))}_delegateEventHandler=e=>{let t=R(e);t&&this._events.get(e.type)?.forEach((n,o)=>{(o===t||o.contains(t))&&n.forEach(r=>r.handleEvent(e))})}},Ut={enterDuration:225,exitDuration:150},dr=800,Yi=vt({passive:!0,capture:!0}),$i=["mousedown","touchstart"],Xi=["mouseup","mouseleave","touchend","touchcancel"],ur=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(n,o){},styles:[`.mat-ripple {
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
`],encapsulation:2,changeDetection:0})}return i})(),Ce=class i{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new rn;constructor(e,t,n,o,r){this._target=e,this._ngZone=t,this._platform=o,o.isBrowser&&(this._containerElement=$(n)),r&&r.get(j).load(ur)}fadeInRipple(e,t,n={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=h(h({},Ut),n.animation);n.centered&&(e=o.left+o.width/2,t=o.top+o.height/2);let a=n.radius||hr(e,t,o),l=e-o.left,c=t-o.top,u=r.enterDuration,d=document.createElement("div");d.classList.add("mat-ripple-element"),d.style.left=`${l-a}px`,d.style.top=`${c-a}px`,d.style.height=`${a*2}px`,d.style.width=`${a*2}px`,n.color!=null&&(d.style.backgroundColor=n.color),d.style.transitionDuration=`${u}ms`,this._containerElement.appendChild(d);let m=window.getComputedStyle(d),k=m.transitionProperty,S=m.transitionDuration,M=k==="none"||S==="0s"||S==="0s, 0s"||o.width===0&&o.height===0,w=new on(this,d,n,M);d.style.transform="scale3d(1, 1, 1)",w.state=N.FADING_IN,n.persistent||(this._mostRecentTransientRipple=w);let q=null;return!M&&(u||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let ln=()=>{q&&(q.fallbackTimer=null),clearTimeout(cn),this._finishRippleTransition(w)},we=()=>this._destroyRipple(w),cn=setTimeout(we,u+100);d.addEventListener("transitionend",ln),d.addEventListener("transitioncancel",we),q={onTransitionEnd:ln,onTransitionCancel:we,fallbackTimer:cn}}),this._activeRipples.set(w,q),(M||!u)&&this._finishRippleTransition(w),w}fadeOutRipple(e){if(e.state===N.FADING_OUT||e.state===N.HIDDEN)return;let t=e.element,n=h(h({},Ut),e.config.animation);t.style.transitionDuration=`${n.exitDuration}ms`,t.style.opacity="0",e.state=N.FADING_OUT,(e._animationForciblyDisabledThroughCss||!n.exitDuration)&&this._finishRippleTransition(e)}fadeOutAll(){this._getActiveRipples().forEach(e=>e.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(e=>{e.config.persistent||e.fadeOut()})}setupTriggerEvents(e){let t=$(e);!this._platform.isBrowser||!t||t===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=t,$i.forEach(n=>{i._eventManager.addHandler(this._ngZone,n,t,this)}))}handleEvent(e){e.type==="mousedown"?this._onMousedown(e):e.type==="touchstart"?this._onTouchStart(e):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Xi.forEach(t=>{this._triggerElement.addEventListener(t,this,Yi)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(e){e.state===N.FADING_IN?this._startFadeOutTransition(e):e.state===N.FADING_OUT&&this._destroyRipple(e)}_startFadeOutTransition(e){let t=e===this._mostRecentTransientRipple,{persistent:n}=e.config;e.state=N.VISIBLE,!n&&(!t||!this._isPointerDown)&&e.fadeOut()}_destroyRipple(e){let t=this._activeRipples.get(e)??null;this._activeRipples.delete(e),this._activeRipples.size||(this._containerRect=null),e===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),e.state=N.HIDDEN,t!==null&&(e.element.removeEventListener("transitionend",t.onTransitionEnd),e.element.removeEventListener("transitioncancel",t.onTransitionCancel),t.fallbackTimer!==null&&clearTimeout(t.fallbackTimer)),e.element.remove()}_onMousedown(e){let t=Et(e),n=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+dr;!this._target.rippleDisabled&&!t&&!n&&(this._isPointerDown=!0,this.fadeInRipple(e.clientX,e.clientY,this._target.rippleConfig))}_onTouchStart(e){if(!this._target.rippleDisabled&&!xt(e)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let t=e.changedTouches;if(t)for(let n=0;n<t.length;n++)this.fadeInRipple(t[n].clientX,t[n].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(e=>{let t=e.state===N.VISIBLE||e.config.terminateOnPointerUp&&e.state===N.FADING_IN;!e.config.persistent&&t&&e.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let e=this._triggerElement;e&&($i.forEach(t=>i._eventManager.removeHandler(t,e,this)),this._pointerUpEventsRegistered&&(Xi.forEach(t=>e.removeEventListener(t,this,Yi)),this._pointerUpEventsRegistered=!1))}};function hr(i,e,t){let n=Math.max(Math.abs(i-t.left),Math.abs(i-t.right)),o=Math.max(Math.abs(e-t.top),Math.abs(e-t.bottom));return Math.sqrt(n*n+o*o)}var Zi=new f("mat-ripple-global-options");var mr={capture:!0},pr=["focus","mousedown","mouseenter","touchstart"],an="mat-ripple-loader-uninitialized",sn="mat-ripple-loader-class-name",Ki="mat-ripple-loader-centered",De="mat-ripple-loader-disabled",qi=(()=>{class i{_document=s(E);_animationsDisabled=rt();_globalRippleOptions=s(Zi,{optional:!0});_platform=s(A);_ngZone=s(y);_injector=s(_);_eventCleanups;_hosts=new Map;constructor(){let t=s(W).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>pr.map(n=>t.listen(this._document,n,this._onInteraction,mr)))}ngOnDestroy(){let t=this._hosts.keys();for(let n of t)this.destroyRipple(n);this._eventCleanups.forEach(n=>n())}configureRipple(t,n){t.setAttribute(an,this._globalRippleOptions?.namespace??""),(n.className||!t.hasAttribute(sn))&&t.setAttribute(sn,n.className||""),n.centered&&t.setAttribute(Ki,""),n.disabled&&t.setAttribute(De,"")}setDisabled(t,n){let o=this._hosts.get(t);o?(o.target.rippleDisabled=n,!n&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(t))):n?t.setAttribute(De,""):t.removeAttribute(De)}_onInteraction=t=>{let n=R(t);if(n instanceof HTMLElement){let o=n.closest(`[${an}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(t){if(!this._document||this._hosts.has(t))return;t.querySelector(".mat-ripple")?.remove();let n=this._document.createElement("span");n.classList.add("mat-ripple",t.getAttribute(sn)),t.append(n);let o=this._globalRippleOptions,r=this._animationsDisabled?0:o?.animation?.enterDuration??Ut.enterDuration,a=this._animationsDisabled?0:o?.animation?.exitDuration??Ut.exitDuration,l={rippleDisabled:this._animationsDisabled||o?.disabled||t.hasAttribute(De),rippleConfig:{centered:t.hasAttribute(Ki),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:r,exitDuration:a}}},c=new Ce(l,this._ngZone,n,this._platform,this._injector),u=!l.rippleDisabled;u&&c.setupTriggerEvents(t),this._hosts.set(t,{target:l,renderer:c,hasSetUpEvents:u}),t.removeAttribute(an)}destroyRipple(t){let n=this._hosts.get(t);n&&(n.renderer._removeTriggerEvents(),this._hosts.delete(t))}static \u0275fac=function(n){return new(n||i)};static \u0275prov=p({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Qi=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["structural-styles"]],decls:0,vars:0,template:function(n,o){},styles:[`.mat-focus-indicator {
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
`],encapsulation:2,changeDetection:0})}return i})();var fr=new f("MAT_BUTTON_CONFIG");function Ji(i){return i==null?void 0:In(i)}var to=(()=>{class i{_elementRef=s(x);_ngZone=s(y);_animationsDisabled=rt();_config=s(fr,{optional:!0});_focusMonitor=s(Bt);_cleanupClick;_renderer=s(H);_rippleLoader=s(qi);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=t,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(t){this.tabIndex=t}constructor(){s(j).load(Qi);let t=this._elementRef.nativeElement;this._isAnchor=t.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(t,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(t="program",n){t?this._focusMonitor.focusVia(this._elementRef.nativeElement,t,n):this._elementRef.nativeElement.focus(n)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}))}static \u0275fac=function(n){return new(n||i)};static \u0275dir=b({type:i,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(n,o){n&2&&(Y("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),Sn(o.color?"mat-"+o.color:""),B("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",U],disabled:[2,"disabled","disabled",U],ariaDisabled:[2,"aria-disabled","ariaDisabled",U],disabledInteractive:[2,"disabledInteractive","disabledInteractive",U],tabIndex:[2,"tabIndex","tabIndex",Ji],_tabindex:[2,"tabindex","_tabindex",Ji]}})}return i})();var eo=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({imports:[X]})}return i})();var gr=["matButton",""],br=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],_r=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var no=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),_c=(()=>{class i extends to{get appearance(){return this._appearance}set appearance(t){this.setAppearance(t||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let t=vr(this._elementRef.nativeElement);t&&this.setAppearance(t)}setAppearance(t){if(t===this._appearance)return;let n=this._elementRef.nativeElement.classList,o=this._appearance?no.get(this._appearance):null,r=no.get(t);o&&n.remove(...o),n.add(...r),this._appearance=t}static \u0275fac=function(n){return new(n||i)};static \u0275cmp=I({type:i,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[O],attrs:gr,ngContentSelectors:_r,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(n,o){n&1&&(Se(br),qt(0,"span",0),Dt(1),xn(2,"span",1),Dt(3,1),An(),Dt(4,2),qt(5,"span",2)(6,"span",3)),n&2&&B("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab)},styles:[`.mat-mdc-button-base {
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
`],encapsulation:2,changeDetection:0})}return i})();function vr(i){return i.hasAttribute("mat-raised-button")?"elevated":i.hasAttribute("mat-stroked-button")?"outlined":i.hasAttribute("mat-flat-button")?"filled":i.hasAttribute("mat-button")?"text":null}var vc=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=D({type:i});static \u0275inj=C({imports:[eo,X]})}return i})();export{Wn as a,Lr as b,So as c,Fo as d,jr as e,Ht as f,nn as g,wl as h,El as i,xl as j,Al as k,Ml as l,_c as m,vc as n};
