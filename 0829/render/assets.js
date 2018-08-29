const assets = {};
function defineAsset(n,f){
  assets[n] = f;
}
function makeAssets(r){
  let as = {};
  for(a in assets){
    as[a] = assets[a](r);
  }
  return as;
}
