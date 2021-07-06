/**
 * @file header相关工具方法
 */

/**
 * @returns web headers
 */
export function getWebHeader() {
    return {
        'Env': 'WEB',
    };

}

/**
 * @returns 客户端 headers
 */
export function getClientHeader() {
    return {
        'Env': 'Client',
    };
}
