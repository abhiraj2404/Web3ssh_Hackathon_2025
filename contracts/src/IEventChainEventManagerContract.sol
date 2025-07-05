// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IEventChainEventManagerContract
 * @dev Interface for EventChainEventManagerContract that manages event creation, ticket minting, and event transfer.
 */
interface IEventChainEventManagerContract {

    /**
     * @dev Creates a new event with the specified details.
     * @param name The name of the event.
     * @param location The location of the event.
     * @param date The date of the event.
     * @param ticketPrice The price of the tickets for the event.
     */
    function createEvent(string memory name, string memory location, string memory date, uint256 ticketPrice) external;

    /**
     * @dev Retrieves the details of a specific event.
     * @param eventId The ID of the event to query.
     * @return An Event struct containing the details of the event.
     */
    function getEventDetails(uint256 eventId) external view returns (Event memory);

    /**
     * @dev Registers a user for an event (called by user themselves).
     * @param eventId The ID of the event to register for.
     */
    function registerForEvent(uint256 eventId) external;

    /**
     * @dev Checks if a user is registered for an event.
     * @param eventId The ID of the event.
     * @param user The address of the user.
     * @return True if the user is registered, false otherwise.
     */
    function isRegistered(uint256 eventId, address user) external view returns (bool);

    /**
     * @dev Mints a ticket for the specified event and assigns it to the specified address.
     * @param eventId The ID of the event for which to mint the ticket.
     * @param to The address to which the ticket will be minted.
     * @param uri The URI for the ticket metadata.
     */
    function mintTicket(uint256 eventId, address to, string memory uri) external;

    /**
     * @dev Emitted when a new event is created.
     * @param eventId The ID of the created event.
     * @param name The name of the event.
     * @param location The location of the event.
     * @param date The date of the event.
     * @param ticketPrice The price of the tickets for the event.
     * @param organizer The address of the organizer of the event.
     */
    event EventCreated(uint256 indexed eventId, string name, string location, string date, uint256 ticketPrice, address organizer);

    /**
     * @dev Emitted when a user registers for an event.
     * @param eventId The ID of the event.
     * @param user The address of the user who registered.
     */
    event UserRegistered(uint256 indexed eventId, address indexed user);




    struct Event {
        string name;
        string location;
        string date;
        uint256 ticketPrice;
        address organizer;
    }
}