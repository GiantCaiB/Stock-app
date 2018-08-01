module.exports = function(cpArr){
    // sort the input array
    var sortArr = sortArray(cpArr);
    var maxPrice = sortArr[sortArr.length-1];
    var minPrice = sortArr[0];
    var maxPriceIndex = cpArr.lastIndexOf(maxPrice);
    var minPriceIndex = cpArr.indexOf(minPrice);
    var resultArr = [];
    var tmp = 0;
    // best situation: [..lowest price ... max price..]
    if(maxPriceIndex>minPriceIndex){
        resultArr = cpArr.slice(minPriceIndex,maxPriceIndex+1);
        return resultArr;
    }
    // case: [..max price...lowest price..]
    for(let i=0;i<cpArr.length;i++){
        if(maxPrice==cpArr[i]){
            sortArr.pop();
            maxPrice = sortArr[sortArr.length-1];
            maxPriceIndex = cpArr.indexOf(maxPrice);
            continue;
        }
        if(maxPrice-cpArr[i]>tmp){
            tmp = maxPrice - cpArr[i];
            sortArr.splice(sortArr.lastIndexOf(cpArr[i]),1);
            resultArr = cpArr.slice(i,maxPriceIndex+1);
            continue;
        }
        if(maxPrice-cpArr[i]<tmp){
            sortArr.splice(sortArr.lastIndexOf(cpArr[i]),1);
            continue;
        }
    }
    return resultArr;
};

function sortArray(arr) {
    return arr.concat().sort(sortNumber);
}
function sortNumber(a,b)
{
    return a - b;
}