// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventNFT is ERC1155, Ownable {
    address public eventManager;

    // Track minted supply per tokenId
    mapping(uint256 => uint256) public totalSupply;

    // Store URI per tokenId
    mapping(uint256 => string) private _tokenURIs;

    modifier onlyEventManager() {
        require(msg.sender == eventManager, "Not authorized");
        _;
    }

    constructor() ERC1155("") Ownable(msg.sender) {}

    function setEventManager(address _manager) external onlyOwner {
        eventManager = _manager;
    }

    function setTokenURI(uint256 _tokenId, string memory _uri) external onlyEventManager {
        _tokenURIs[_tokenId] = _uri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function mint(address to, uint256 id, uint256 amount, uint256 maxSupply) external onlyEventManager {
        require(totalSupply[id] + amount <= maxSupply, "Exceeds max supply");
        totalSupply[id] += amount;
        _mint(to, id, amount, "");
    }
}
