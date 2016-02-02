// rsa �ӽ��ܷ�����
window.rsaUtil = {
	// rsa ��λ�� ��Ŀǰ���Ա��ƽ����768λ�������û���ƹ��ˣ�
	_keySize: 1024,
	// rsa ��key, ��˽Կ�����й�Կ��ʵ��˽Կ��һ���ֶ��ѣ���xml���ַ�����ʽ���ڣ����Դ��ڴ��϶�ȡ
	_rsaKeyStr: '',
	// �Ƿ��м� padding ����
	doOaepPadding: false,
	// ��ȡ�µ�rsa provider
	getNewRsaProvider: function (dwKeySize) {
		// Create a new instance of RSACryptoServiceProvider.
		if (!dwKeySize) dwKeySize = this._keySize;
		return new System.Security.Cryptography.RSACryptoServiceProvider(dwKeySize);
	},
	// ���������µ�rsa��key������˽Կ��ֵ���ڱ��ش洢
	setNewRsaKey: function(){
		var rsa = this.getNewRsaProvider();
		this._rsaKeyStr = rsa.ToXmlString(true);
		return this._rsaKeyStr;
	},
	// ��ȡrsa key
	getRsaKey: function (includePrivateParameters, rsaKeyStr) {
		var rsa = this.getNewRsaProvider();
		// Import parameters from xml.
		// ֱ�Ӱ�key����ȥ��������ȡ�������Ϣ�������Ƿ��й�Կ����˽Կ����Ϣ
		rsa.FromXmlString(rsaKeyStr);
		// Export RSA key to RSAParameters and include:
		//    false - ���ܹ��̣�ֻҪ����Կ�����ˣ�������� rsaKeyStr Ҫ�й�Կ��Ϣ
		//    true  - ���ܹ��̣�Ҫ��˽Կ��������� rsaKeyStr Ҫ��˽Կ��Ϣ
		return rsa.ExportParameters(includePrivateParameters);
	},
	// ����rsa����
	encrypt: function(bytes, publishKey){
		var doOaepPadding = this.doOaepPadding;
		// ���û�д���Կ�����൱��ʹ���Լ��Ĺ�Կ
		publishKey = publishKey || this._rsaKeyStr;
		var rsa = this.getNewRsaProvider();
		// Import the RSA Key information.
		rsa.ImportParameters(this.getRsaKey(false,publishKey));
		// Encrypt the passed byte array and specify OAEP padding.
		return rsa.Encrypt(bytes, doOaepPadding);
	},
	// ����rsa���ܲ�ת��Ϊbase64���
	encryptToBase64: function(data,publishKey){
		var bytes = System.Text.Encoding.UTF8.GetBytes(data);
		var encryptedBytes = this.encrypt(bytes,publishKey);
		return System.Convert.ToBase64String(encryptedBytes);
	},
	// rsa ����
	decrypt: function(bytes){
		var doOaepPadding = this.doOaepPadding;
		var rsa = this.getNewRsaProvider();
		// Import the RSA Key information.
		rsa.ImportParameters(this.getRsaKey(true,this._rsaKeyStr));
		// Decrypt the passed byte array and specify OAEP padding.
		return rsa.Decrypt(bytes, doOaepPadding);
	},
	// ����rsa���ܲ�ת��Ϊbase64���
	decryptToBase64: function(data){
		var encryptedBytes = System.Convert.FromBase64String(data);
		var decryptedBytes = this.decrypt(encryptedBytes);
		return System.Text.Encoding.UTF8.GetString(decryptedBytes);
	},
	// ��ȡ��Կ����˽Կ��Ҳ����key����ȡ������
	getPublishKey: function(){
		return this._rsaKeyStr.replace(/(<\/Exponent>)(\S+)(<\/RSAKeyValue>)/gm,'$1$3');
	},
	// ��ȡ˽Կ����ʵ����key
	getPrivateKey: function(){
		return this._rsaKeyStr;
	},
	// ����key
	setRsaKeyValue: function(str){
		this._rsaKeyStr = str;
	},
	// ���� λ��
	setKeySize: function(str){
		this._keySize = parseInt(str);
	},
	// ���� padding ��ʽ
	setPadding: function(padding){
		this.doOaepPadding = padding;
	}
};