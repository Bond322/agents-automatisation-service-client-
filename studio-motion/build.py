#!/usr/bin/env python3
"""Assemble Studio-Motion.html : l'interface (source/studio.html) + le moteur HyperFrames intégré."""
import json, pathlib
ici = pathlib.Path(__file__).parent
page = (ici / "source" / "studio.html").read_text(encoding="utf-8")
moteur = (ici / "source" / "hyperframe.runtime.iife.js").read_text(encoding="utf-8")
chaine = json.dumps(moteur, ensure_ascii=True).replace("<", "\\u003c")
marque = '/*__HF_RUNTIME__*/""'
assert page.count(marque) == 1
(ici / "Studio-Motion.html").write_text(page.replace(marque, chaine), encoding="utf-8")
print("Studio-Motion.html :", round((ici / "Studio-Motion.html").stat().st_size / 1024), "Ko")
