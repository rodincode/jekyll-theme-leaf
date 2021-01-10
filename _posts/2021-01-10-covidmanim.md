#COVID-19 Data Analysis using Manim

```python
import os
!git clone https://github.com/3b1b/manim.git
!apt-get install -qqy --no-install-recommends \
        apt-utils \
        ffmpeg \
        sox \
        libcairo2-dev \
        texlive \
        texlive-fonts-extra \
        texlive-latex-extra \
        texlive-latex-recommended \
        texlive-science \
        tipa 
os.chdir("manim")
!python setup.py sdist
!python -m pip install dist/manimlib*


"""Colab-specific file helpers."""

from __future__ import absolute_import as _
from __future__ import division as _
from __future__ import print_function as _

import base64 as _base64
import collections as _collections
import os as _os
import socket as _socket
import threading as _threading
import uuid as _uuid

import IPython as _IPython
import portpicker as _portpicker
import six as _six
from six.moves import SimpleHTTPServer as _SimpleHTTPServer
from six.moves import socketserver as _socketserver
from six.moves import urllib as _urllib

from google.colab import output as _output
from IPython.display import display, HTML
js = """<div id=\"put\">
<script>document.getElementById(\"put\").innerHTML=\"sup\"</script>
"""

def _get_unique_filename(filename):
  if not _os.path.lexists(filename):
    return filename
  counter = 1
  while True:
    path, ext = _os.path.splitext(filename)
    new_filename = '{} ({}){}'.format(path, counter, ext)
    if not _os.path.lexists(new_filename):
      return new_filename
    counter += 1


class _V6Server(_socketserver.TCPServer):
  address_family = _socket.AF_INET6


class _FileHandler(_SimpleHTTPServer.SimpleHTTPRequestHandler):
  """SimpleHTTPRequestHandler with a couple tweaks."""

  def translate_path(self, path):
    # Client specifies absolute paths.
    # TODO(b/79760241): Remove this spurious lint warning.
    return _urllib.parse.unquote(path)  # pylint:disable=too-many-function-args

  def log_message(self, fmt, *args):
    # Suppress logging since it's on the background. Any errors will be reported
    # via the handler.
    pass

  def end_headers(self):
    # Do not cache the response in the notebook, since it may be quite large.
    self.send_header('x-colab-notebook-cache-control', 'no-cache')
    _SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

#@markdown I defined a download function that downloads a video/creates a video tag and displays it, with a button next to it, however sometimes, it doesn't work when you just created a scene, what you can do in that case is just call `download` again but separetely
def download(filename):
  """Downloads the file to the user's local disk via a browser download action.
  Args:
    filename: Name of the file on disk to be downloaded.
  Raises:
    OSError: if the file cannot be found.
  """

  if not _os.path.exists(filename):
    msg = 'Cannot find file: {}'.format(filename)
    if _six.PY2:
      raise OSError(msg)
    else:
      raise FileNotFoundError(msg)  # pylint: disable=undefined-variable

  started = _threading.Event()
  port = _portpicker.pick_unused_port()

  def server_entry():
    httpd = _V6Server(('::', port), _FileHandler)
    started.set()
    # Handle a single request then exit the thread.
    httpd.handle_request()

  thread = _threading.Thread(target=server_entry)
  thread.start()
  started.wait()
  display(HTML( ("""
  <div id=\"put\">Wait for the video to load/download</div><script>
      (async function() {
        const response = await fetch('https://localhost:%(port)d%(path)s');
        if (!response.ok) {
          throw new Error('Failed to download: ' + response.statusText);
        }
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = '%(name)s';
        a.innerHTML="download file here"
        document.getElementById("put").innerHTML=`<video width="960" height="720" controls>
  <source src="${a.href}" type="video/mp4">
</video>`
        document.getElementById("put").appendChild(a);
        //document.write(a);
        //a.click();
        //a.remove();
      })();
      </script>
  """ % {
      'port': port,
      'path': _os.path.abspath(filename),
      'name': _os.path.basename(filename),
  })))
#@markdown I define a custom function called  `render` this custom function takes a python dict and gives it to manim in order to convert it to a scene.

from manimlib.imports import *
import manimlib
import types
import argparse
import colour
import importlib.util
import os
import sys
from manimlib.utils.config_ops import DictAsObject
from manimlib.config import get_camera_configuration
import manimlib.constants
#module 

def render(scenes,args):
    module = types.ModuleType("input_scenes")
    exec("""from manimlib.imports import *""", module.__dict__)
    for v in scenes:
        setattr(module,v,scenes[v])
        getattr(module,v).__module__='input_scenes'

    file_writer_config = {
        # By default, write to file
        "write_to_movie": args.write_to_movie or not args.save_last_frame,
        "save_last_frame": args.save_last_frame,
        "save_pngs": args.save_pngs,
        "save_as_gif": args.save_as_gif,
        # If -t is passed in (for transparent), this will be RGBA
        "png_mode": "RGBA" if args.transparent else "RGB",
        "movie_file_extension": ".mov" if args.transparent else ".mp4",
        "file_name": args.file_name,
        "input_file_path": args.file,
    }
    if hasattr(module, "OUTPUT_DIRECTORY"):
        file_writer_config["output_directory"] = module.OUTPUT_DIRECTORY
    config = {
        "module": module,
        "scene_names": args.scene_names,
        "open_video_upon_completion": args.preview,
        "show_file_in_finder": args.show_file_in_finder,
        "file_writer_config": file_writer_config,
        "quiet": args.quiet or args.write_all,
        "ignore_waits": args.preview,
        "write_all": args.write_all,
        "start_at_animation_number": args.start_at_animation_number,
        "end_at_animation_number": None,
        "sound": args.sound,
        "leave_progress_bars": args.leave_progress_bars,
        "media_dir": args.media_dir,
        "video_dir": args.video_dir,
        "video_output_dir": args.video_output_dir,
        "tex_dir": args.tex_dir,
    }

    # Camera configuration
    config["camera_config"] = get_camera_configuration(args)

    # Arguments related to skipping
    stan = config["start_at_animation_number"]
    if stan is not None:
        if "," in stan:
            start, end = stan.split(",")
            config["start_at_animation_number"] = int(start)
            config["end_at_animation_number"] = int(end)
        else:
            config["start_at_animation_number"] = int(stan)

    config["skip_animations"] = any([
        file_writer_config["save_last_frame"],
        config["start_at_animation_number"],
    ])
    #if not kwargs["file"]:

    manimlib.constants.initialize_directories(config)
    manimlib.extract_scene.main(config)
    
    
from manimlib.utils.config_ops import DictAsObject
args=DictAsObject({"write_to_movie":False,"save_last_frame": False,
        "save_pngs": False,
        "save_as_gif": False,
        # If -t is passed in (for transparent), this will be RGBA
        "transparent": False,
        "file":"",
        "file_name":"repl",
        "scene_names": ["Demo"],
        "preview": False,
        "show_file_in_finder": False,
        "low_quality": False,
        "medium_quality": False,
        "high_quality": False,
        "resolution": None,
        "color":None,
        "quiet": False,
        "write_all": None,
        "start_at_animation_number": None,
        "end_at_animation_number": None,
        "sound": None,
        "leave_progress_bars": True,
        "media_dir": None,
        "video_dir": None,
        "video_output_dir": None,
        "tex_dir": None})
        
        
import numpy as np
from numpy import exp
from scipy.integrate import odeint

pop_size = 3.3e8
γ = 1 / 18
σ = 1 / 5.2

def F(x, t, R0=1.6):
    """
    Time derivative of the state vector.

        * x is the state vector (array_like)
        * t is time (scalar)
        * R0 is the effective transmission rate, defaulting to a constant

    """
    s, e, i = x

    # New exposure of susceptibles
    β = R0(t) * γ if callable(R0) else R0 * γ
    ne = β * s * i

    # Time derivatives
    ds = - ne
    de = ne - σ * e
    di = σ * e - γ * i

    return ds, de, di

i_0 = 1e-7
e_0 = 4 * i_0
s_0 = 1 - i_0 - e_0
x_0 = s_0, e_0, i_0


def solve_path(R0, t_vec, x_init=x_0):
    """
    Solve for i(t) and c(t) via numerical integration,
    given the time path for R0.

    """
    G = lambda x, t: F(x, t, R0)
    s_path, e_path, i_path = odeint(G, x_init, t_vec).transpose()

    c_path = 1 - s_path - e_path       # cumulative cases
    return i_path, c_path

t_length = 550
grid_size = 1000
t_vec = np.linspace(0, t_length, grid_size)

R0_vals = np.linspace(1.6, 3.0, 6)
labels = [f'$R0 = {r:.2f}$' for r in R0_vals]
i_paths, c_paths = [], []

for r in R0_vals:
    i_path, c_path = solve_path(r, t_vec)
    i_paths.append(i_path)
    c_paths.append(c_path)

def plot_paths(paths, labels, times=t_vec):

    fig, ax = plt.subplots()

    for path, label in zip(paths, labels):
        #ax.plot(times, path, label=label)
        yield times,path
    #ax.legend(loc='upper left')

    #plt.show()

import matplotlib.pyplot as plt
plot_paths(c_paths,labels)

values = []
for c_path in c_paths:
    for i in c_path:
        values.append(i)


values = values[::600]
print(values,type(values))
print(len(values))

def return_val(cood):
    lst = []
    for i in range(len(cood)):
        lst.append(0)
    for x in range(len(cood)):
        lst.insert(x, cood[x])
        lst.pop()
    return lst
    print(lst)


#IMPORT DATA
import pandas as pd

def cases(country):
  df = pd.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/countries-aggregated.csv",
                 parse_dates = ["Date"])
  df= df[df["Country"]==country]
  df["Cases"] = df[['Confirmed','Recovered','Deaths']].sum(axis=1)  # Making a new col. for total cases
  #df = df.drop(columns=["Confirmed","Recovered","Deaths"])
  #df = df.pivot(index = "Date", columns="Country", values = "Cases")
  df = df["Cases"].values
  lst=[]
  for i in df:
    lst.append(i)
  return (lst[::5])

print(len(cases("India")),type(cases("India")))
    
    
from math import sin
class CSV(GraphScene, Scene):

    def construct(self):
      #self.setup_axes(animate=False)
      labelx = TextMobject("weeks")
      labely = TextMobject("cases")
      labelx.shift(3*DOWN)
      labely.shift(5*LEFT)
      #gra = self.get_graph(self.func)
      #graph_c = self.get_graph(self.plot_paths)

      coords = cases('United Kingdom')
      for i in range(len(coords)):
         vals = return_val(coords)
         c3 = BarChart(vals, stroke_width=15, color="#463dec",fill_color="#34efda",  fill_opacity=1, max_value=30000000)

      coords = cases('India')
    
      for i in range(len(coords)):
         vals = return_val(coords)
         c1 = BarChart(vals, stroke_width=15, color="#88FF00",fill_color="#FFFF00",  fill_opacity=1, max_value=30000000)

      coords = cases('US')
    
      for i in range(len(coords)):
         vals = return_val(coords)
         c2 = BarChart(vals, stroke_width=15, color="#abc123",fill_color="#472df0",  fill_opacity=1, max_value=30000000)
      
  
      #self.play(Write(labelx))
      #self.play(Write(labely))
      #self.play(ShowCreation(graph_c))
      self.play(ShowCreation(c3))
      self.play(ShowCreation(c2))
      self.play(ShowCreation(c1))

    def func(self, x):   # Make a func just like sin,plot that returns/yields values of x at different instances
      return sin(x)
      #  yield c_path()
    
    def plot_paths(self, paths, times=t_vec):

        #fig, ax = plt.subplots()
        for path in paths:
          return path
        '''for path, label in zip(paths, labels):
            #ax.plot(times, path, label=label)
            return times,path'''
      


# Tylor Expansions 
render({"Demo":CSV},args)
download("/content/manim/media/videos/1440p60/repl.mp4")
```

#### [Run this code in Google Colaboratory] : https://colab.research.google.com/drive/1ZGfJZro52Vsgl4a91LS_XsopBLGbLYiA
