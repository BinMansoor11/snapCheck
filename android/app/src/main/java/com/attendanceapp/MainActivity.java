package com.attendanceapp;

import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash; 
import android.os.Bundle;

public class MainActivity extends ReactActivity {



 @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // <- display the generated bootsplash.xml drawable over our MainActivity
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AttendanceApp";
  }
}
