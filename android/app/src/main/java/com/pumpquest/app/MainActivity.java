package com.pumpquest.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import androidx.webkit.WebViewAssetLoader;

import java.io.OutputStream;

/** Offline-first Android wrapper. No account, network, telemetry, or dangerous storage permissions. */
public final class MainActivity extends Activity {
  private static final int PICK_FILE = 301;
  private static final int SAVE_FILE = 302;
  private WebView webView;
  private ValueCallback<Uri[]> fileCallback;
  private byte[] exportBytes;

  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    getWindow().setStatusBarColor(Color.rgb(4, 10, 19));
    getWindow().setNavigationBarColor(Color.rgb(4, 10, 19));
    final WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
      .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
    webView = new WebView(this);
    webView.setBackgroundColor(Color.rgb(4, 10, 19));
    webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setAllowFileAccess(false);
    settings.setAllowContentAccess(false);
    settings.setJavaScriptCanOpenWindowsAutomatically(false);
    settings.setMediaPlaybackRequiresUserGesture(true);
    webView.addJavascriptInterface(new NativeBridge(), "PumpQuestNative");
    webView.setWebViewClient(new WebViewClient() {
      @Override public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return assets.shouldInterceptRequest(request.getUrl());
      }
      @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return !"appassets.androidplatform.net".equals(request.getUrl().getHost());
      }
    });
    webView.setWebChromeClient(new WebChromeClient() {
      @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        if(fileCallback!=null)fileCallback.onReceiveValue(null);
        fileCallback=callback;
        Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.setType("*/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"text/csv","text/plain","application/json","application/octet-stream"});
        startActivityForResult(intent,PICK_FILE);
        return true;
      }
    });
    setContentView(webView);
    webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html");
  }

  private final class NativeBridge {
    @JavascriptInterface public void saveFile(String fileName,String mime,String base64) {
      try {
        final byte[] bytes=Base64.decode(base64,Base64.DEFAULT);
        final String safe=fileName.replaceAll("[^a-zA-Z0-9._-]","_").substring(0,Math.min(fileName.length(),110));
        runOnUiThread(()->{
          exportBytes=bytes;
          Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
          intent.addCategory(Intent.CATEGORY_OPENABLE);
          intent.setType(mime!=null&&mime.contains("csv")?"text/csv":"application/json");
          intent.putExtra(Intent.EXTRA_TITLE,safe);
          startActivityForResult(intent,SAVE_FILE);
        });
      }catch(Exception ex){android.util.Log.e("PumpQuest","Export error",ex);}
    }
  }

  @Override protected void onActivityResult(int requestCode,int resultCode,Intent data) {
    super.onActivityResult(requestCode,resultCode,data);
    if(requestCode==PICK_FILE){
      if(fileCallback!=null){
        Uri[] files=resultCode==RESULT_OK&&data!=null&&data.getData()!=null?new Uri[]{data.getData()}:null;
        fileCallback.onReceiveValue(files);fileCallback=null;
      }
    }else if(requestCode==SAVE_FILE&&resultCode==RESULT_OK&&data!=null&&data.getData()!=null&&exportBytes!=null){
      try(OutputStream out=getContentResolver().openOutputStream(data.getData())){if(out!=null)out.write(exportBytes);}
      catch(Exception ex){android.util.Log.e("PumpQuest","Save failed",ex);}
      exportBytes=null;
    }
  }
  @Override public void onBackPressed(){
    if(webView==null){super.onBackPressed();return;}
    webView.evaluateJavascript("window.PQ_APP_BACK?window.PQ_APP_BACK():false",value->{
      if(!"true".equals(value))MainActivity.super.onBackPressed();
    });
  }
  @Override protected void onDestroy(){
    if(webView!=null){webView.removeJavascriptInterface("PumpQuestNative");webView.destroy();}
    super.onDestroy();
  }
}