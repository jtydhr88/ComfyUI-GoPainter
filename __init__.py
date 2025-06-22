from .ComfyUIGoPainter import NODE_CLASS_MAPPINGS
import os
import nodes
from aiohttp import web
from datetime import datetime
import execution
import logging
from pathlib import Path
import random
import re

js_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "js")

nodes.EXTENSION_WEB_DIRS["ComfyUI-GoPainter"] = js_dir

__all__ = ['NODE_CLASS_MAPPINGS']

from server import PromptServer

routes = PromptServer.instance.routes

import uuid
import json

server_address = "127.0.0.1:8188"
client_id = str(uuid.uuid4())

def post_prompt(params, workflow_name):
    logging.info("got prompt")

    current_dir = Path(__file__).parent

    workflow_name = workflow_name + ".json"

    json_file_path = current_dir / "workflows" / workflow_name

    try:
        with open(json_file_path, 'r') as file:
            p = json.load(file)
    except FileNotFoundError:
        print(f"文件未找到: {json_file_path}")
        return web.json_response({"error": "file not found", "node_errors": ""}, status=400)
    except json.JSONDecodeError as e:
        print(f"JSON解析错误: {e}")
        return web.json_response({"error": "json parsed error", "node_errors": ""}, status=400)

    if workflow_name.startswith("default"):
        p["6"]["inputs"]["text"] = params.get("prompt", "")

        p["3"]["inputs"]["seed"] = 5

    print(p)

    s = PromptServer.instance

    json_data = {"prompt": p, "client_id": client_id}

    if "number" in json_data:
        number = float(json_data['number'])
    else:
        number = s.number
        if "front" in json_data:
            if json_data['front']:
                number = -number

        s.number += 1

    if "prompt" in json_data:
        prompt = json_data["prompt"]
        valid = execution.validate_prompt(prompt)
        extra_data = {}
        if "extra_data" in json_data:
            extra_data = json_data["extra_data"]

        if "client_id" in json_data:
            extra_data["client_id"] = json_data["client_id"]
        if valid[0]:
            prompt_id = str(uuid.uuid4())
            outputs_to_execute = valid[2]
            s.prompt_queue.put((number, prompt_id, prompt, extra_data, outputs_to_execute))
            response = {"prompt_id": prompt_id, "number": number, "node_errors": valid[3]}

            print(response)

            return web.json_response(response)
        else:
            logging.warning("invalid prompt: {}".format(valid[1]))
            return web.json_response({"error": valid[1], "node_errors": valid[3]}, status=400)
    else:
        error = {
            "type": "no_prompt",
            "message": "No prompt provided",
            "details": "No prompt provided",
            "extra_info": {}
        }
        return web.json_response({"error": error, "node_errors": {}}, status=400)


@routes.post('/gopainter/api/smart-suggestions')
async def api_smart_suggestions(request):
    try:
        reader = await request.multipart()

        uploaded_file = None
        params = {}

        async for field in reader:
            if field.name == 'image':
                if field.filename:
                    file_data = await field.read()
                    uploaded_file = {
                        'filename': field.filename,
                        'size': len(file_data),
                        'content_type': field.headers.get('Content-Type', 'image/png')
                    }
            else:
                value = await field.text()
                params[field.name] = value

        return post_prompt(params, "fetch-prompt")
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return web.json_response({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)


@routes.post('/gopainter/api/test')
async def api_test(request):
    try:
        reader = await request.multipart()

        uploaded_file = None
        params = {}

        async for field in reader:
            if field.name == 'image':
                if field.filename:
                    file_data = await field.read()
                    uploaded_file = {
                        'filename': field.filename,
                        'size': len(file_data),
                        'content_type': field.headers.get('Content-Type', 'image/png')
                    }
            else:
                value = await field.text()
                params[field.name] = value

        return post_prompt(params, "default")
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return web.json_response({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)