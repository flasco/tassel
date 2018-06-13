//
//  HTTPHelper.m
//  CodeLogin
//
//  Created by Czq on 2018/6/13.
//  Copyright © 2018年 Czq. All rights reserved.
//

#import "HTTPHelper.h"

@implementation HTTPHelper

+ (NSString *)dealWithParam:(NSDictionary *)param
{
    NSArray *allkeys = [param allKeys];
    
    NSMutableString *result = [NSMutableString string];
    
    for (NSString *key in allkeys) {
        
        NSString *str = [NSString stringWithFormat:@"%@=%@&",key,param[key]];
        
        [result appendString:str];
    }
    
    return [result substringWithRange:NSMakeRange(0, result.length-1)];
    
}

+ (void)postRequestByServiceUrl:(NSString *)service
                         andApi:(NSString *)api
                      andParams:(NSDictionary *)params
                    andCallBack:(void (^)(id obj))callback

{
    NSString *basePath = [service stringByAppendingString:api];
    
    NSURL *url = [NSURL URLWithString:basePath];
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    [request setHTTPMethod:@"POST"];
    
    NSString *body = [self dealWithParam:params];
    NSData *bodyData = [body dataUsingEncoding:NSUTF8StringEncoding];
    
    // 设置请求体
    [request setHTTPBody:bodyData];
    
    // 设置本次请求的提交数据格式
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    // 设置本次请求请求体的长度(因为服务器会根据你这个设定的长度去解析你的请求体中的参数内容)
    [request setValue:[NSString stringWithFormat:@"%ld",bodyData.length] forHTTPHeaderField:@"Content-Length"];
    
    // 设置本次请求的最长时间
    request.timeoutInterval = 20;
    
    NSURLSession *session = [NSURLSession sharedSession];
    
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
         if (dic) {
            callback(dic);
        }else
        {
            callback(error.description);
        }
    }];
    [task resume];
    
}
@end
