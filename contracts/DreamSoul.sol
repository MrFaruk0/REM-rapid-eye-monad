// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DreamSoul is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event DreamMinted(address indexed to, uint256 indexed tokenId, string uri);

    constructor() ERC721("Dream Soul", "DREAM") Ownable(msg.sender) {}

    /**
     * @dev Mint a new DreamSoul NFT. Can be called by anyone for their own legendary dreams.
     * @param to The address receiving the NFT
     * @param uri The metadata URI (e.g. JSON string or IPFS link)
     */
    function mintDream(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit DreamMinted(to, tokenId, uri);
        
        return tokenId;
    }
}
