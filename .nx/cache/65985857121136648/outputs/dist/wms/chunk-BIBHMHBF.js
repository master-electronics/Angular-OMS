import{f as c,h as a,j as s}from"./chunk-C55YZZU5.js";import{Aa as i,va as r}from"./chunk-N7LPRJLK.js";var p=s`
    query fetchOMSConfigValue($name: String) {
  fetchConfigValue(Name: $name) {
    Value
  }
}
    `,f=(()=>{let t=class t extends a{constructor(e){super(e),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();var d=(()=>{let t=class t{constructor(e){this._config=e}getValue(e){return this._config.fetch({name:e},{fetchPolicy:"network-only"})}};t.\u0275fac=function(n){return new(n||t)(i(f))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();export{d as a};
