// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./EventNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventManager is Ownable {
    struct EventData {
        uint256 tokenId;
        string metadataURI;
        uint256 maxSupply;
        bool exists;
    }

    EventNFT public eventNFT;
    uint256 public nextTokenId = 1;

    // Map UUID string → event details
    mapping(string => EventData) public events;

    constructor(address _eventNFT) Ownable(msg.sender) {
        eventNFT = EventNFT(_eventNFT);
    }

    function createEvent(
        string memory uuid,
        string memory metadataURI,
        uint256 maxSupply
    ) external {
        require(!events[uuid].exists, "Event already exists");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        events[uuid] = EventData({
            tokenId: tokenId,
            metadataURI: metadataURI,
            maxSupply: maxSupply,
            exists: true
        });

        // Set per-token URI in EventNFT
        eventNFT.setTokenURI(tokenId, metadataURI);
    }

    function mintToAttendee(
        string memory uuid,
        address attendee,
        uint256 amount
    ) external {
        require(events[uuid].exists, "Event does not exist");

        EventData memory e = events[uuid];
        eventNFT.mint(attendee, e.tokenId, amount, e.maxSupply);
    }

    function getTokenId(string memory uuid) external view returns (uint256) {
        require(events[uuid].exists, "Event does not exist");
        return events[uuid].tokenId;
    }
}
