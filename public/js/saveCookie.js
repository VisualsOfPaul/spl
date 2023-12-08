document.addEventListener('DOMContentLoaded', () => {
    const URI = new URL(window.location.href);
    const PASSWORD = URI.searchParams.get('password');

    if(PASSWORD != null) {
        document.cookie = `password = ${PASSWORD}`;

        history.replaceState({}, document.title, "/dashboard");
    }
});