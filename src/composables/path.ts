const tokenPathRegex = /^\/([a-zA-Z0-9]{4})-?([a-zA-Z0-9]{4})\/?$/;

const getPathInfo = (pathname: string) => {
    const result = tokenPathRegex.exec(pathname);
    if (result === null) return { token: null };
    return {
        token: `${result[1]}-${result[2]}`.toUpperCase(),
    };
}

const replacePath = (token: string | null) => {
    const normalized = token === null ? '/' : `/${token.toUpperCase()}`;
    if (normalized !== window.location.pathname) {
        const newURL = new URL(window.location.toString());
        newURL.pathname = normalized;
        window.history.replaceState(null, '', newURL);
    }
}

export const usePath = () => {
    const { token } = getPathInfo(window.location.pathname);
    replacePath(token);
    return {
        token,
        replacePath,
    };
}
