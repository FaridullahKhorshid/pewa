/**
 * Ewa tetris Application API
 * This is a Spring Boot RESTful Api for EWA tetris.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * One to Many relationship with Entity GameUser.
 */
export interface GameUser { 
    /**
     * Unique identifier of the GameUser.
     */
    id?: number;
    /**
     * User id who want to play the game.
     */
    userId: number;
    /**
     * Game id that user wants to play
     */
    gameId: number;
    /**
     * Score of the User in the Game
     */
    score: number;
}

