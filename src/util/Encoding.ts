import qs from 'qs';

export default class Encoding {

    /**
     * Encodes data in the 'x-www-form-urlencoded' format.
     * [Extremely] common for most older web applications or non-JSON APIs.
     *
     * @param data The {object} that you wish to be form-URL-encoded.
     */
    static formURL(data: object) : string {
        return qs.stringify(data);
    }

}