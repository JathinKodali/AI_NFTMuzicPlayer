from flask import Flask, request, jsonify
import json
import ipfshttpclient

app = Flask(__name__)
ipfs = ipfshttpclient.connect()

@app.route("/")
def home():
    return "AI Music NFT Backend is Running!"

@app.route("/upload", methods=["POST"])
def upload_music():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename
    file.save(filename)

    try:
        # Upload music file to IPFS
        ipfs_response = ipfs.add(filename)
        ipfs_hash = ipfs_response["Hash"]
        music_uri = f"ipfs://{ipfs_hash}"

        # Create NFT metadata
        metadata = {
            "name": filename,
            "description": "AI-generated music NFT",
            "music_url": music_uri
        }
        
        metadata_filename = f"{filename}.json"
        with open(metadata_filename, "w") as f:
            json.dump(metadata, f)

        # Upload metadata to IPFS
        metadata_ipfs_response = ipfs.add(metadata_filename)
        metadata_ipfs_hash = metadata_ipfs_response["Hash"]

        return jsonify({"metadata_uri": f"ipfs://{metadata_ipfs_hash}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
