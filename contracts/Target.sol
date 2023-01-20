//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Target is Ownable{
    uint256 private value;
// evnts
event ValueChanged(uint256 newValue);

function store(uint256 newValue)public onlyOwner{
    value=newValue;
    emit ValueChanged(newValue);

}
//Reading the value
function retrieve()public view returns(uint256){
    return value;
}
}