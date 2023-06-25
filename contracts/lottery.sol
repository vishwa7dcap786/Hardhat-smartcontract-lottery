//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19 ;


import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

contract lottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    
    
    enum latterystatus {
        OPEN,
        CALCULATING
    }


    uint public immutable i_entrenceFee;
    address payable[] private s_participants;
    bytes32 private immutable i_keyHash;
    uint64 private immutable s_subscriptionId;
    uint16 private constant i_requestConfirmations = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant  i_numWords = 1;
    uint256 private s_lastblocktime;
    uint256 private immutable i_interval;
    address private s_recentWinner;
    VRFCoordinatorV2Interface private immutable CoordinatorV2;
    latterystatus private s_latterystatus;
    

    event EnteredIn  (address indexed );
    event requestRandomWinnerId  (uint256 indexed requestId);
    event recentlatterywinner (address indexed recentWinner);
    
    
    error lattery_notEnoughAmountSpent();
    error lattery_transferfailed();
    error lattery_latterisnotopen();
    error lattery_upkeepnotneeded(uint256 currentbalance , uint256 numParticipants , uint256 latterystate);

    constructor (address vrfCoordinatorV2  ,
                uint entrenceFee,
                bytes32 gaslean,
                uint64 subscriptionId,
                uint32 callbackGasLimit,
                uint256 interval
    )
                
        VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_keyHash = gaslean;
        i_callbackGasLimit = callbackGasLimit;
        s_subscriptionId= subscriptionId;
        i_entrenceFee=entrenceFee;
        CoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        s_latterystatus = latterystatus.OPEN;
        s_lastblocktime = block.timestamp;
        i_interval = interval;
    }
  


    function participate() public payable {
        if(msg.value < i_entrenceFee){
            revert lattery_notEnoughAmountSpent();
        }
        if(s_latterystatus != latterystatus.OPEN){
            revert lattery_latterisnotopen();
        }
        s_participants.push(payable(msg.sender)) ;
        emit EnteredIn (msg.sender);
    }




    function checkUpkeep(bytes memory /*checkdata*/)
    public view override 
    returns(bool upkeepneeded,
    bytes memory /* performdata*/){

        bool player = (s_participants.length>0);
        bool balances = (address(this).balance>0);
        bool isopen = (s_latterystatus == latterystatus.OPEN) ;
        bool timestamp = ((block.timestamp - s_lastblocktime)>i_interval);
        upkeepneeded = (player && balances && isopen && timestamp);

    }



    function performUpkeep(bytes calldata /*performdata*/ ) 
    external override {
        (bool upkeepneeded,) = checkUpkeep("");
        if(!upkeepneeded){
            revert lattery_upkeepnotneeded(address(this).balance, s_participants.length , uint256(s_latterystatus));
        }
        s_latterystatus = latterystatus.CALCULATING;
        uint256 requestId  =  CoordinatorV2.requestRandomWords(
            i_keyHash,
            s_subscriptionId,
            i_requestConfirmations,
            i_callbackGasLimit,
            i_numWords);
        emit requestRandomWinnerId  (requestId);

    }



    function fulfillRandomWords(uint256 /*_requestId*/,
         uint256[] memory _randomWords 
    ) internal override{
        uint256 indexofwinner = _randomWords[0] % s_participants.length;
        address payable recentWinner = s_participants[indexofwinner];
        s_recentWinner = recentWinner;
        (bool success,) = s_recentWinner.call{value : address(this).balance}("");
        if(!success){
            revert lattery_transferfailed();
        }
        emit recentlatterywinner (recentWinner);
        s_participants = new address payable[](0);
        s_lastblocktime = block.timestamp;
        s_latterystatus = latterystatus.OPEN;
    }



    function getEntrenceFee() view public returns (uint){
        return i_entrenceFee;
    }



    function getParticipates(uint index) view public returns (address){
        return s_participants[index];
    } 



    function getrecentwinner() view public returns (address){
        return s_recentWinner;
    }


    function getlatterystatus() view public returns (latterystatus){
        return s_latterystatus;
    }

    function getnumwords() pure public returns (uint32){
        return i_numWords;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastblocktime;
    }

    function getNumberOfParticipants() public view returns (uint256) {
        return s_participants.length;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return i_requestConfirmations;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    } 
}