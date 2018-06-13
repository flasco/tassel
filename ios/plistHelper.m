//
//  plistHelper.m
//  tassel
//
//  Created by Czq on 2018/6/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "plistHelper.h"

@implementation plistHelper
+ (void)setPlist:(NSString*)status {
  // 获取到Caches文件夹路径
  NSString *cachePath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
  
  // 拼接文件名
  NSString *filePath = [cachePath stringByAppendingPathComponent:@"login.plist"];
  // 将数据封装成array
  NSArray *array = @[status];
  // 将字典持久化到沙盒文件中
  [array writeToFile:filePath atomically:YES];
}
+ (NSString*) getPlist {
  // 获取到Caches文件夹路径
  NSString *cachePath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
  
  // 拼接文件名
  NSString *filePath = [cachePath stringByAppendingPathComponent:@"login.plist"];
  NSArray *result = [NSArray arrayWithContentsOfFile:filePath];
  NSLog(@"res - %@",result);
  if(result.count == 0) return @"0";
  else return result[0];
}
@end
