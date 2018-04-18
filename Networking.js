
export default class Networking {

    static async uploadData(data) {

        let success = false;

        try {
            let res = await fetch('http://192.168.100.8:3000/motion', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: data
            });

            if (res.ok) {
                console.log('[+] Sent')
                success = true;
            }

            console.log(res.status, res.statusText);
        }
        catch (err) {
            console.warn(err.message);
        }
        finally {
            return success;
        }
    }
}